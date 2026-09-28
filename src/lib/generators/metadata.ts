export interface GeneratorMetadata {
  id: string;
  displayId: string;
  target: string;
  version: string;
  zmkRevision: string;
  lvglRevision: string;
}

export const niceViewGenerator: GeneratorMetadata = {
  id: "nice-view-zmk-main",
  displayId: "nice-view",
  target: "zmk-main",
  version: "1",
  zmkRevision: "5b51501fead672c41b5cfb396f3dafe0894bf4e9",
  lvglRevision: "f1db87ee98f1810328a8419572fa42a3b5f352ae",
};
