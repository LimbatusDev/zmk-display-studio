import assert from "node:assert/strict";
import { resolveObjectURL } from "node:buffer";
import { test, type TestContext } from "node:test";
import { loadImage } from "../src/lib/image/image-loader.ts";

function installImage(
  context: TestContext,
  decode: () => Promise<void>,
  width = 140,
  height = 68,
) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "Image");
  const element = {
    src: "",
    naturalWidth: width,
    naturalHeight: height,
    decode,
  };
  Object.defineProperty(globalThis, "Image", {
    configurable: true,
    value: function Image() {
      return element;
    },
  });
  context.after(() => {
    URL.revokeObjectURL(element.src);
    if (previous) Object.defineProperty(globalThis, "Image", previous);
    else Reflect.deleteProperty(globalThis, "Image");
  });
  return element;
}

const file = new File([new Uint8Array(1024)], "art.png", {
  type: "image/png",
});

test("loadImage keeps the Blob available during decoding and releases it after success", async (context) => {
  const decode = Promise.withResolvers<void>();
  const element = installImage(context, () => decode.promise);
  const revoke = context.mock.method(URL, "revokeObjectURL");

  const loading = loadImage(file);
  const url = element.src;
  assert.equal(resolveObjectURL(url)?.size, file.size);
  assert.equal(revoke.mock.callCount(), 0);

  decode.resolve();
  const source = await loading;

  assert.equal(source.element, element);
  assert.equal(source.width, 140);
  assert.equal(source.height, 68);
  assert.equal(element.src, url);
  assert.equal(resolveObjectURL(url), undefined);
  assert.equal(revoke.mock.callCount(), 1);
  assert.deepEqual(revoke.mock.calls[0].arguments, [url]);
});

test("loadImage releases the Blob and clears the element when decoding fails", async (context) => {
  const decode = Promise.withResolvers<void>();
  const element = installImage(context, () => decode.promise);
  const revoke = context.mock.method(URL, "revokeObjectURL");

  const loading = loadImage(file);
  const url = element.src;
  decode.reject(new DOMException("Invalid image", "EncodingError"));

  await assert.rejects(loading, /This image could not be decoded/);
  assert.equal(resolveObjectURL(url), undefined);
  assert.equal(element.src, "");
  assert.equal(revoke.mock.callCount(), 1);
  assert.deepEqual(revoke.mock.calls[0].arguments, [url]);
});

test("loadImage releases the Blob when decoded dimensions are rejected", async (context) => {
  const decode = Promise.withResolvers<void>();
  const element = installImage(context, () => decode.promise, 16_385, 1);
  const revoke = context.mock.method(URL, "revokeObjectURL");

  const loading = loadImage(file);
  const url = element.src;
  decode.resolve();

  await assert.rejects(loading, /Image dimensions are too large/);
  assert.equal(resolveObjectURL(url), undefined);
  assert.equal(element.src, "");
  assert.equal(revoke.mock.callCount(), 1);
  assert.deepEqual(revoke.mock.calls[0].arguments, [url]);
});
