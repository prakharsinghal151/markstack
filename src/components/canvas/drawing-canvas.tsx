"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useCallback, useMemo, useState } from "react";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw as any,
  {
    ssr: false,
  },
) as any;

interface DrawingCanvasProps {
  initialData?: any;
  onChange?: (elements: readonly any[], appState: any, files: any) => void;
  onSave?: (data: {
    elements: readonly any[];
    appState: any;
    files: any;
  }) => void;
  readOnly?: boolean;
  theme?: "light" | "dark";
  className?: string;
  excalidrawAPI?: (api: any) => void;
}

interface UndoRedoState {
  past: Array<{ elements: readonly any[]; appState: any }>;
  present: { elements: readonly any[]; appState: any };
  future: Array<{ elements: readonly any[]; appState: any }>;
}

export default function DrawingCanvas({
  initialData,
  onChange,
  onSave,
  readOnly = false,
  theme = "light",
  className = "",
  excalidrawAPI,
}: DrawingCanvasProps) {
  const excalidrawRef = useRef<any>(null);
  const initialDataRef = useRef<any>(null);
  const hasInitialized = useRef(false);
  const lastCanvasDataRef = useRef<any>(null);

  // Safe initial data creation with useMemo
  const safeInitialData = useMemo(() => {
    if (!initialData) return undefined;

    return {
      elements: initialData?.elements || [],
      appState: {
        collaborators: Array.isArray(initialData?.appState?.collaborators)
          ? initialData.appState.collaborators
          : [],
        viewBackgroundColor:
          initialData?.appState?.viewBackgroundColor || "#ffffff",
        currentItemStrokeColor:
          initialData?.appState?.currentItemStrokeColor || "#1e1e1e",
        currentItemBackgroundColor:
          initialData?.appState?.currentItemBackgroundColor || "transparent",
        currentItemFillStyle:
          initialData?.appState?.currentItemFillStyle || "solid",
        currentItemStrokeWidth:
          initialData?.appState?.currentItemStrokeWidth || 1,
        currentItemStrokeStyle:
          initialData?.appState?.currentItemStrokeStyle || "solid",
        currentItemRoughness: initialData?.appState?.currentItemRoughness || 1,
        currentItemOpacity: initialData?.appState?.currentItemOpacity || 100,
        currentFontFamily: initialData?.appState?.currentFontFamily || 1,
        currentFontSize: initialData?.appState?.currentFontSize || 20,
        currentTextAlign: initialData?.appState?.currentTextAlign || "left",
        currentTextVerticalAlign:
          initialData?.appState?.currentTextVerticalAlign || "top",
        currentItemStartArrowhead:
          initialData?.appState?.currentItemStartArrowhead || null,
        currentItemEndArrowhead:
          initialData?.appState?.currentItemEndArrowhead || null,
        scrollX: initialData?.appState?.scrollX || 0,
        scrollY: initialData?.appState?.scrollY || 0,
        zoom: initialData?.appState?.zoom || { value: 1 },
        viewModeEnabled: initialData?.appState?.viewModeEnabled || false,
        zenModeEnabled: initialData?.appState?.zenModeEnabled || false,
        gridModeEnabled: initialData?.appState?.gridModeEnabled || false,
      },
      files: {},
    };
  }, [initialData?.id, initialData?.elements?.length]); // Only depend on stable values

  // Initialize canvas data once on mount - CRITICAL FIX
  useEffect(() => {
    if (!safeInitialData) return;

    // Only initialize if we haven't already
    if (hasInitialized.current) {
      return;
    }

    initialDataRef.current = safeInitialData;
    hasInitialized.current = true;
  }, [safeInitialData]);

  // Handle canvas changes with proper state management
  const handleChange = useCallback(
    (elements: readonly any[], appState: any, files: any) => {
      const newCanvasData = { elements, appState };
      if (
        JSON.stringify(lastCanvasDataRef.current) ===
        JSON.stringify(newCanvasData)
      ) {
        return;
      }

      lastCanvasDataRef.current = newCanvasData;

      if (onChange) {
        onChange(elements, appState, files);
      }
    },
    [onChange],
  );

  const undo = useCallback(() => {
    if (!initialDataRef.current) return;

    const currentData = lastCanvasDataRef.current;
    if (!currentData) return;

    // Create previous state from current elements (simplified)
    const previousElements = currentData.elements.slice(0, -1);
    if (previousElements.length === 0) return;

    const newCanvasData = {
      elements: previousElements,
      appState: currentData.appState,
    };

    lastCanvasDataRef.current = newCanvasData;

    if (excalidrawRef.current) {
      excalidrawRef.current.updateScene({
        elements: previousElements,
        appState: currentData.appState,
      });
    }

    if (onChange) {
      onChange(previousElements, currentData.appState, {});
    }
  }, [onChange]);

  const redo = useCallback(() => {
  }, [onChange]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (readOnly) return;

      // Ctrl+Z for undo, Ctrl+Shift+Z for redo
      if (event.ctrlKey || event.metaKey) {
        if (event.shiftKey && event.key === "z") {
          event.preventDefault();
          redo();
        } else if (event.key === "z") {
          event.preventDefault();
          undo();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, readOnly]);

  return (
    <div className={`h-full w-full ${className}`}>
      <Excalidraw
        initialData={safeInitialData}
        onChange={handleChange}
        viewModeEnabled={readOnly}
        theme={theme}
        excalidrawAPI={(api: any) => {
          excalidrawRef.current = api;
          if (excalidrawAPI) {
            excalidrawAPI(api);
          }
        }}
      />
    </div>
  );
}
