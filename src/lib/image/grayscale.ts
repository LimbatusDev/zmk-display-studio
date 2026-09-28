/** Adjust RGB channels without changing alpha or the caller's buffer. */
export function applyBrightness(rgba: Uint8ClampedArray, amount: number) {
  const output = new Uint8ClampedArray(rgba);
  const offset = (amount / 100) * 255;
  for (let i = 0; i < output.length; i += 4) {
    output[i] += offset;
    output[i + 1] += offset;
    output[i + 2] += offset;
  }
  return output;
}

export function applyContrast(rgba: Uint8ClampedArray, amount: number) {
  const output = new Uint8ClampedArray(rgba);
  const contrast = (amount / 100) * 255;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < output.length; i += 4) {
    output[i] = factor * (output[i] - 128) + 128;
    output[i + 1] = factor * (output[i + 1] - 128) + 128;
    output[i + 2] = factor * (output[i + 2] - 128) + 128;
  }
  return output;
}

/** Rec. 709 luma; callers composite transparency before entering the pipeline. */
export function toGrayscale(rgba: Uint8ClampedArray) {
  if (rgba.length % 4 !== 0) throw new Error("Expected RGBA pixels.");
  const output = new Uint8ClampedArray(rgba.length / 4);
  for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
    output[p] = 0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2];
  }
  return output;
}
