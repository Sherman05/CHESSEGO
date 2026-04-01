export async function captureScreenshot(): Promise<Blob | null> {
  try {
    const domtoimage = await import('dom-to-image-more');
    const boardEl = document.querySelector('[data-board-capture]') as HTMLElement;
    if (!boardEl) return null;

    // dom-to-image-more handles SVG images properly
    const blob = await domtoimage.toBlob(boardEl, {
      bgcolor: '#e8e8e8',
      quality: 1,
      style: {
        // Ensure the element is fully visible for capture
        overflow: 'visible',
      },
    });

    return blob;
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
