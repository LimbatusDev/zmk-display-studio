import type { Size } from "../displays/types.ts";

/** A locally drawn portrait study; no remote image or network request. */
export async function createSampleArtwork(size: Size) {
  const canvas = document.createElement("canvas");
  const width = size.width * 6;
  const height = size.height * 6;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not create a canvas.");
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#777777");
  sky.addColorStop(1, "#fafafa");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(width * 0.73, height * 0.19, width * 0.13, 0, Math.PI * 2);
  context.fill();
  const mountain = (points: number[][], color: string) => {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, height);
    for (const [x, y] of points) context.lineTo(x * width, y * height);
    context.lineTo(width, height);
    context.fill();
  };
  mountain(
    [
      [0, 0.57],
      [0.16, 0.49],
      [0.4, 0.3],
      [0.68, 0.6],
      [0.88, 0.48],
      [1, 0.59],
    ],
    "#555555",
  );
  mountain(
    [
      [0.4, 0.3],
      [0.46, 0.48],
      [0.39, 0.44],
      [0.33, 0.48],
      [0.31, 0.42],
      [0.16, 0.49],
    ],
    "#f9f9f9",
  );
  mountain(
    [
      [0, 0.76],
      [0.25, 0.64],
      [0.42, 0.73],
      [0.7, 0.55],
      [1, 0.79],
    ],
    "#999999",
  );
  mountain(
    [
      [0, 0.86],
      [0.24, 0.81],
      [0.47, 0.9],
      [0.79, 0.77],
      [1, 0.84],
    ],
    "#202020",
  );
  context.fillStyle = "#121212";
  for (const [fractionX, fractionH] of [
    [0.1, 0.17],
    [0.22, 0.11],
    [0.84, 0.14],
    [0.95, 0.2],
  ]) {
    const x = fractionX * width;
    const h = fractionH * height;
    const bottom = height * 0.98;
    context.fillRect(x - width * 0.006, bottom - h, width * 0.012, h);
    for (let tier = 0; tier < 4; tier++) {
      const y = bottom - h + tier * (h / 5);
      const span = width * (0.025 + tier * 0.016);
      context.beginPath();
      context.moveTo(x, y - h * 0.12);
      context.lineTo(x - span, y + h / 3);
      context.lineTo(x + span, y + h / 3);
      context.fill();
    }
  }
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) =>
        value
          ? resolve(value)
          : reject(new Error("Could not create sample artwork.")),
      "image/png",
    ),
  );
  return new File([blob], "alpine-study.png", { type: "image/png" });
}
