export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  try {
    anchor.href = url;
    anchor.download = filename;
    document.body.append(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    // Let browsers finish consuming the URL before releasing the backing data.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
