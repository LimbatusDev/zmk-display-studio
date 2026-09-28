type DiffusionTap = readonly [dx: number, dy: number, weight: number];
const floydSteinberg: readonly DiffusionTap[] = [
  [1, 0, 7 / 16],
  [-1, 1, 3 / 16],
  [0, 1, 5 / 16],
  [1, 1, 1 / 16],
];
// Atkinson intentionally diffuses only 6/8 of the error.
const atkinson: readonly DiffusionTap[] = [
  [1, 0, 1 / 8],
  [2, 0, 1 / 8],
  [-1, 1, 1 / 8],
  [0, 1, 1 / 8],
  [1, 1, 1 / 8],
  [0, 2, 1 / 8],
];

function diffuse(
  grayscale: Uint8ClampedArray,
  width: number,
  height: number,
  taps: readonly DiffusionTap[],
) {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    grayscale.length !== width * height
  )
    throw new Error("Invalid grayscale dimensions.");
  const errors = new Float32Array(grayscale);
  const output = new Uint8Array(grayscale.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const white = errors[index] >= 128;
      output[index] = white ? 1 : 0;
      const error = errors[index] - (white ? 255 : 0);
      for (const [dx, dy, weight] of taps) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny < height)
          errors[ny * width + nx] += error * weight;
      }
    }
  }
  return output;
}

export function applyFloydSteinberg(
  grayscale: Uint8ClampedArray,
  width: number,
  height: number,
) {
  return diffuse(grayscale, width, height, floydSteinberg);
}

export function applyAtkinson(
  grayscale: Uint8ClampedArray,
  width: number,
  height: number,
) {
  return diffuse(grayscale, width, height, atkinson);
}
