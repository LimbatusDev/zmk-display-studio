"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadImage, releaseImage } from "@/lib/image/image-loader";
import { createSampleArtwork } from "@/lib/image/sample-artwork";
import { useEditorStore } from "@/store/editor-store";
import { getDisplay } from "@/lib/displays/registry";

export function useImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(
    () => () => {
      request.current++;
      useEditorStore.getState().setSourceImage(null);
    },
    [],
  );
  const upload = useCallback(async (file: File | Promise<File>) => {
    const id = ++request.current;
    setBusy(true);
    setError(null);
    try {
      const image = await loadImage(await file);
      if (id !== request.current) {
        releaseImage(image);
        return;
      }
      useEditorStore.getState().setSourceImage(image);
    } catch (cause) {
      if (id === request.current)
        setError(
          cause instanceof Error ? cause.message : "Could not open this image.",
        );
    } finally {
      if (id === request.current) setBusy(false);
    }
  }, []);
  const clear = () => {
    request.current++;
    setBusy(false);
    setError(null);
    useEditorStore.getState().setSourceImage(null);
  };
  const sample = () =>
    upload(
      createSampleArtwork(
        getDisplay(useEditorStore.getState().displayId).artwork.physical,
      ),
    );
  return {
    inputRef,
    busy,
    error,
    upload,
    clear,
    sample,
    choose: () => inputRef.current?.click(),
  };
}
