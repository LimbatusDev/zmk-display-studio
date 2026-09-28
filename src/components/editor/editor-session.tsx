"use client";

import { useEffect } from "react";
import { connectPreferences, useEditorStore } from "@/store/editor-store";

/** The shared layout owns the session so route changes preserve working artwork. */
export function EditorSession() {
  useEffect(() => {
    const disconnectPreferences = connectPreferences();
    return () => {
      disconnectPreferences();
      useEditorStore.getState().setSourceImage(null);
    };
  }, []);

  return null;
}
