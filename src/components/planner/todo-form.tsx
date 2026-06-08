"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TodoFormProps {
  onSubmit: (title: string, description?: string) => void;
  onCancel: () => void;
  selectedDate?: Date;
  className?: string;
}

export function TodoForm({
  onSubmit,
  onCancel,
  selectedDate,
  className,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit(title.trim(), description.trim() || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className={`space-y-3 p-4 border rounded-lg bg-muted/50 animate-in slide-in-from-top-2 ${className}`}
    >
      <Input
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <Textarea
        placeholder="Description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full min-h-[80px]"
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={!title.trim()}>
          Add Task
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            onCancel();
            setTitle("");
            setDescription("");
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
