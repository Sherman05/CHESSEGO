export async function captureScreenshot(): Promise<Blob | null> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    // Capture the board element directly (the actual board with pieces)
    const boardEl = document.querySelector('[data-board-capture]') as HTMLElement;
    if (!boardEl) return null;

    const canvas = await html2canvas(boardEl, {
      backgroundColor: '#e8e8e8',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });
  } catch (e) {
    console.error('Screenshot failed:', e);
    return null;
  }
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
