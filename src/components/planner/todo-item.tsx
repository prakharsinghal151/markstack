"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { type Todo } from "./index";

interface TodoItemProps {
  todo: Todo;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  className?: string;
}

export function TodoItem({
  todo,
  onToggleTodo,
  onDeleteTodo,
  className,
}: TodoItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${className}`}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(checked) => onToggleTodo(todo.id, checked as boolean)}
        className="mt-1 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div
          className={`font-medium break-words ${todo.completed ? "line-through text-muted-foreground" : ""}`}
        >
          {todo.title}
        </div>
        {todo.description && (
          <div
            className={`text-sm text-muted-foreground mt-1 break-words ${todo.completed ? "line-through" : ""}`}
          >
            {todo.description}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDeleteTodo(todo.id)}
        className="text-destructive hover:text-destructive shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
