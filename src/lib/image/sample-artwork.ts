/** A locally drawn sample; no remote image or network request. */
export async function createSampleArtwork() {
  const canvas = document.createElement("canvas");
  canvas.width = 840;
  canvas.height = 408;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not create a canvas.");
  const sky = context.createLinearGradient(0, 0, 0, 408);
  sky.addColorStop(0, "#8b8b8b");
  sky.addColorStop(1, "#fafafa");
  context.fillStyle = sky;
  context.fillRect(0, 0, 840, 408);
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(624, 111, 57, 0, Math.PI * 2);
  context.fill();
  const mountain = (points: number[][], color: string) => {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, 408);
    for (const [x, y] of points) context.lineTo(x, y);
    context.lineTo(840, 408);
    context.fill();
  };
  mountain(
    [
      [0, 265],
      [115, 156],
      [170, 200],
      [295, 40],
      [477, 253],
      [570, 190],
      [718, 270],
      [840, 215],
    ],
    "#555555",
  );
  mountain(
    [
      [295, 40],
      [330, 190],
      [295, 157],
      [276, 173],
      [259, 137],
      [170, 200],
    ],
    "#f9f9f9",
  );
  mountain(
    [
      [0, 340],
      [160, 280],
      [266, 326],
      [474, 195],
      [638, 330],
      [840, 277],
    ],
    "#999999",
  );
  mountain(
    [
      [0, 366],
      [220, 338],
      [380, 392],
      [670, 308],
      [840, 347],
    ],
    "#202020",
  );
  context.fillStyle = "#121212";
  for (const [x, h] of [
    [56, 110],
    [105, 75],
    [743, 95],
    [793, 133],
  ]) {
    context.fillRect(x - 3, 395 - h, 6, h);
    for (let tier = 0; tier < 4; tier++) {
      const y = 395 - h + tier * (h / 5);
      const span = 14 + tier * 8;
      context.beginPath();
      context.moveTo(x, y - 20);
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
