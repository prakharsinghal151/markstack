"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddTaskCardProps {
  selectedDate: Date;
  onAddTodo: (title: string, description?: string) => void;
  className?: string;
}

export function AddTaskCard({
  selectedDate,
  onAddTodo,
  className,
}: AddTaskCardProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAddTodo(title.trim(), description.trim() || undefined);
    setTitle("");
    setDescription("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Add Task</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-3">
          <Input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
            onKeyDown={handleKeyDown}
          />
          <Textarea
            placeholder="Add details (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[100px] resize-none"
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleSubmit}
            className="w-full transition-all duration-200 bg-black text-white hover:bg-black/90"
            size="lg"
          >
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
