import JSZip from "jszip";

/** Fixed timestamps and ordering keep identical export packages reproducible. */
export async function generateZip(files: Record<string, string>) {
  const zip = new JSZip();
  for (const name of Object.keys(files).sort()) {
    zip.file(`zmk-display-studio-export/${name}`, files[name], {
      date: new Date("2026-01-01T00:00:00Z"),
      createFolders: false,
    });
  }
  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
    platform: "UNIX",
  });
}
