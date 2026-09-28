import type { SourceImage } from "../../types/editor.ts";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_PIXELS = 40_000_000;
const MAX_DIMENSION = 16_384;

export function validateImageFile(file: Pick<File, "type" | "size">) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
    throw new Error("Choose a PNG, JPEG, or WebP image.");
  if (file.size === 0)
    throw new Error("This file is empty. Choose another image.");
  if (file.size > MAX_FILE_SIZE)
    throw new Error("This image is too large. The limit is 10 MB.");
}

export async function loadImage(file: File): Promise<SourceImage> {
  validateImageFile(file);
  const url = URL.createObjectURL(file);
  const element = new Image();
  try {
    element.src = url;
    await element.decode();
    const width = element.naturalWidth;
    const height = element.naturalHeight;
    if (!width || !height) throw new Error("The image has no usable pixels.");
    if (
      width * height > MAX_PIXELS ||
      Math.max(width, height) > MAX_DIMENSION
    ) {
      throw new Error(
        "Image dimensions are too large. Use up to 40 megapixels and 16,384 pixels per side.",
      );
    }
    return { name: file.name, width, height, size: file.size, url, element };
  } catch (error) {
    URL.revokeObjectURL(url);
    element.src = "";
    if (error instanceof Error && error.name !== "EncodingError") throw error;
    throw new Error(
      "This image could not be decoded. It may be damaged or use an unsupported encoding.",
    );
  }
}

export function releaseImage(source: SourceImage | null) {
  if (source) URL.revokeObjectURL(source.url);
}
