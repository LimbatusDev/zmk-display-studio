export function applyThreshold(grayscale: Uint8ClampedArray, threshold = 128) {
  const pixels = new Uint8Array(grayscale.length);
  for (let i = 0; i < pixels.length; i++)
    pixels[i] = grayscale[i] >= threshold ? 1 : 0;
  return pixels;
}
