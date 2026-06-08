"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import DrawingCanvas from "@/components/canvas/drawing-canvas";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Save,
  Share2,
  Download,
  FileImage,
  FileJson,
  FileCode,
} from "lucide-react";

interface CanvasData {
  elements: readonly any[];
  appState: any;
  files: any;
}

export default function CanvasPage() {
  const params = useParams();
  const { theme } = useTheme();
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const excalidrawAPIRef = useRef<any>(null);

  const canvasId = params.id as string;

  const createCanvas = useCallback(async () => {
    try {
      const response = await fetch(`/api/canvas/${canvasId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Untitled Canvas",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create canvas");
      }

      const data = await response.json();
      setCanvasData(data.canvas.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create canvas");
    } finally {
      setLoading(false);
    }
  }, [canvasId]);

  const fetchCanvas = useCallback(async () => {
    try {
      const response = await fetch(`/api/canvas/${canvasId}`);

      if (!response.ok) {
        if (response.status === 404) {
          await createCanvas();
          return;
        }
        throw new Error("Canvas not found");
      }

      const data = await response.json();
      setCanvasData(data.canvas.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load canvas");
    } finally {
      setLoading(false);
    }
  }, [canvasId, createCanvas]);

  useEffect(() => {
    if (!canvasData) {
      fetchCanvas();
    }
  }, [canvasId, fetchCanvas]);

  const saveCanvasData = async (data: CanvasData) => {
    if (saving) return;

    setSaving(true);
    try {
      const response = await fetch("/api/canvas/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          canvasId,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save canvas");
      }
    } catch (err) {
      console.error("Save error:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (saving || !canvasData) return;

    try {
      await saveCanvasData(canvasData);
      toast.success("Canvas saved!");
    } catch (err) {
      toast.error("Failed to save canvas");
    }
  };

  const handleCanvasChange = useCallback(
    (elements: readonly any[], appState: any, files: any) => {
      const newCanvasData = {
        elements,
        appState,
        files,
      };
      setCanvasData(newCanvasData);
    },
    [],
  );

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Canvas link copied to clipboard!");
    } catch (clipboardError) {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Canvas link copied to clipboard!");
    }
  };

  const handleExportPNG = async () => {
    if (!excalidrawAPIRef.current) return;

    try {
      const elements = excalidrawAPIRef.current.getSceneElements();

      if (!elements || !elements.length) {
        toast.error("Canvas is empty");
        return;
      }

      const { exportToBlob } = await import("@excalidraw/excalidraw");

      const blob = await exportToBlob({
        elements,
        appState: excalidrawAPIRef.current.getAppState(),
        files: excalidrawAPIRef.current.getFiles(),
        mimeType: "image/png",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `canvas-${canvasId}.png`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("PNG exported successfully");
    } catch (error) {
      toast.error("Failed to export PNG");
    }
  };

  const handleExportSVG = async () => {
    if (!excalidrawAPIRef.current) return;

    try {
      const elements = excalidrawAPIRef.current.getSceneElements();

      if (!elements || !elements.length) {
        toast.error("Canvas is empty");
        return;
      }

      const { exportToSvg } = await import("@excalidraw/excalidraw");

      const svg = await exportToSvg({
        elements,
        appState: excalidrawAPIRef.current.getAppState(),
        files: excalidrawAPIRef.current.getFiles(),
      });

      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `canvas-${canvasId}.svg`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("SVG exported successfully");
    } catch (error) {
      toast.error("Failed to export SVG");
    }
  };

  const handleExportJSON = async () => {
    if (!excalidrawAPIRef.current) return;

    try {
      const elements = excalidrawAPIRef.current.getSceneElements();

      const appState = excalidrawAPIRef.current.getAppState();
      const files = excalidrawAPIRef.current.getFiles();

      const { serializeAsJSON } = await import("@excalidraw/excalidraw");

      const serialized = serializeAsJSON(elements, appState, files, "local");

      const blob = new Blob([serialized], { type: "application/json" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `canvas-${canvasId}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("JSON exported successfully");
    } catch (error) {
      toast.error("Failed to export JSON");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (loading || !canvasData) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-muted-foreground">Loading canvas...</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full w-full">
        {/* Editor Header */}

        <div className="border-b bg-background px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2 min-w-0">
              <h1 className="text-lg font-semibold truncate">Canvas</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-end sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />

                {saving ? "Saving..." : "Save"}
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem onClick={handleExportPNG}>
                    <FileImage className="w-4 h-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleExportSVG}>
                    <FileCode className="w-4 h-4 mr-2" />
                    Export as SVG
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleExportJSON}>
                    <FileJson className="w-4 h-4 mr-2" />
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Canvas Workspace */}
        <div className="flex-1 relative overflow-hidden">
          <DrawingCanvas
            initialData={canvasData}
            onSave={saveCanvasData}
            onChange={handleCanvasChange}
            excalidrawAPI={(api) => {
              excalidrawAPIRef.current = api;
            }}
            theme={theme as "light" | "dark"}
            className="absolute inset-0"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
