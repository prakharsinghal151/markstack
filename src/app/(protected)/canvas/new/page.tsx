"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { nanoid } from "nanoid";

export default function NewCanvasPage() {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const createCanvas = async () => {
    if (!title.trim()) {
      toast.error("Please enter a canvas title");
      return;
    }

    setCreating(true);
    try {
      const canvasId = nanoid();
      const response = await fetch("/api/canvas/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create canvas");
      }

      const data = await response.json();
      toast.success("Canvas created successfully!");
      router.push(`/canvas/${data.canvas.id}`);
    } catch (error) {
      toast.error("Failed to create canvas");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Canvas</CardTitle>
          <CardDescription>
            Start drawing with our interactive whiteboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Canvas Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter canvas title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createCanvas();
                }
              }}
            />
          </div>
          <Button
            onClick={createCanvas}
            disabled={creating || !title.trim()}
            className="w-full bg-black text-white hover:bg-black/90 disabled:bg-black/50"
          >
            {creating ? "Creating..." : "Create Canvas"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
