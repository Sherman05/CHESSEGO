export async function captureScreenshot(): Promise<Blob | null> {
  try {
    const domtoimage = await import('dom-to-image-more');
    const boardEl = document.querySelector('[data-board-capture]') as HTMLElement;
    if (!boardEl) return null;

    const blob = await domtoimage.toBlob(boardEl, {
      bgcolor: '#e8e8e8',
      quality: 1,
      style: { overflow: 'visible' },
    });

    return blob;
  } catch (e) {
    console.error('Screenshot failed:', e);
    return null;
  }
}

function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

export async function saveScreenshotToFile(blob: Blob, filename: string, folderPath: string | null): Promise<boolean> {
  try {
    if (isTauri()) {
      const { writeFile, mkdir, exists } = await import('@tauri-apps/plugin-fs');
      const { join, desktopDir, pictureDir } = await import('@tauri-apps/api/path');

      let dir: string;
      if (folderPath) {
        dir = folderPath;
      } else {
        try { dir = await pictureDir(); } catch { dir = await desktopDir(); }
      }

      if (!(await exists(dir))) {
        await mkdir(dir, { recursive: true });
      }

      const arrayBuffer = await blob.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const cleanName = filename.replace(/[<>:"/\\|?*]/g, '_');
      const path = await join(dir, cleanName);

      await writeFile(path, data);
      return true;
    } else {
      downloadBlob(blob, filename);
      return true;
    }
  } catch (e) {
    console.error('Save screenshot failed:', e);
    downloadBlob(blob, filename);
    return true;
  }
}

export async function createPartyFolder(folderName: string): Promise<string | null> {
  try {
    if (isTauri()) {
      const { mkdir, exists } = await import('@tauri-apps/plugin-fs');
      const { join, desktopDir } = await import('@tauri-apps/api/path');

      const desktop = await desktopDir();
      const cleanName = folderName.replace(/[<>:"/\\|?*]/g, '_');
      const path = await join(desktop, cleanName);

      if (!(await exists(path))) {
        await mkdir(path, { recursive: true });
      }

      return path;
    }
  } catch (e) {
    console.error('Create folder failed:', e);
  }
  return folderName;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
