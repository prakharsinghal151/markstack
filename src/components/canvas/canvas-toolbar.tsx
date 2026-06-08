"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Save,
  Share2,
  Download,
  MoreHorizontal,
  Copy,
  FileImage,
  FileJson,
  FileCode,
} from "lucide-react";

interface CanvasToolbarProps {
  canvasId: string;
  excalidrawAPI: any | null;
  onSave?: () => void;
  isSaving?: boolean;
  isReadOnly?: boolean;
}

export default function CanvasToolbar({
  canvasId,
  excalidrawAPI,
  onSave,
  isSaving = false,
  isReadOnly = false,
}: CanvasToolbarProps) {
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    toast.success("Canvas saved!");
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Canvas link copied to clipboard!");
    } catch (clipboardError) {
      // Fallback if clipboard API fails
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
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      if (!elements || !elements.length) {
        toast.error("Canvas is empty");
        return;
      }

      const { exportToBlob } = await import("@excalidraw/excalidraw");
      const blob = await exportToBlob({
        elements,
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
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
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      if (!elements || !elements.length) {
        toast.error("Canvas is empty");
        return;
      }

      const { exportToSvg } = await import("@excalidraw/excalidraw");
      const svg = await exportToSvg({
        elements,
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
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
    if (!excalidrawAPI) return;

    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();

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

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold">Canvas</h1>
        </div>

        <div className="flex items-center space-x-2">
          {!isReadOnly && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save canvas</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy canvas link</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

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
    </TooltipProvider>
  );
}
