"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { Plus, Eye, Share2, Trash2, Palette, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AuthGuard } from "@/components/auth/auth-guard";
import { toast } from "sonner";

interface Canvas {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function AllCanvasesPage() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCanvases();
  }, []);

  const fetchCanvases = async () => {
    try {
      const response = await fetch("/api/canvases");
      if (!response.ok) {
        throw new Error("Failed to fetch canvases");
      }
      const data = await response.json();
      setCanvases(data.canvases);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load canvases");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCanvas = async (canvasId: string) => {
    if (!confirm("Are you sure you want to delete this canvas?")) {
      return;
    }

    try {
      const response = await fetch(`/api/canvas/${canvasId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ canvasId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete canvas");
      }

      setCanvases(canvases.filter((canvas) => canvas.id !== canvasId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete canvas");
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <PageSkeleton cardCount={8} gridCols="2" />
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="px-4 sm:px-6 py-6 max-w-screen-2xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Canvases
          </h1>
          <Link href="/canvas/new">
            <Button className="w-full sm:w-auto bg-black text-white hover:bg-black/90">
              <Plus className="w-4 h-4 mr-2" />
              New Canvas
            </Button>
          </Link>
        </div>
        {canvases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Palette className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center">
              No canvases yet
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-8 text-sm sm:text-base">
              Start creating by setting up your first design canvas. Organize
              your ideas, sketches, and projects in one place.
            </p>
            <Link href="/canvas/new">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black text-white hover:bg-black/90"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Canvas
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {canvases.map((canvas) => (
              <Card
                key={canvas.id}
                className="group transition-all duration-200 hover:border-foreground/20 hover:shadow-md cursor-pointer h-full"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <CardTitle className="text-base font-semibold truncate group-hover:text-foreground flex-1">
                      {canvas.title || "Untitled Canvas"}
                    </CardTitle>

                    <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {new Date(canvas.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    Updated{" "}
                    {formatDistanceToNow(new Date(canvas.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                    <Link
                      href={`/canvas/${canvas.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            `${window.location.origin}/canvas/${canvas.id}`,
                          );
                          toast.success("Link copied to clipboard");
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCanvas(canvas.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
