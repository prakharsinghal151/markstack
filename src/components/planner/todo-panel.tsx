"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, isToday } from "date-fns";
import { CalendarDays, Plus } from "lucide-react";
import { TodoForm, TodoList, type Todo } from "./index";

interface TodoPanelProps {
  selectedDate: Date;
  todos: Todo[];
  loading: boolean;
  onAddTodo: (title: string, description?: string) => void;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  className?: string;
}

export function TodoPanel({
  selectedDate,
  todos,
  loading,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  className,
}: TodoPanelProps) {
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const handleAddTodo = (title: string, description?: string) => {
    onAddTodo(title, description);
    setIsAddingTodo(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            {format(selectedDate, "EEEE, MMMM d")}
            {isToday(selectedDate) && <Badge variant="secondary">Today</Badge>}
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddingTodo(!isAddingTodo)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Todo Form */}
        {isAddingTodo && (
          <TodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setIsAddingTodo(false)}
          />
        )}

        {/* Todo List */}
        <TodoList
          todos={todos}
          loading={loading}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
        />
      </CardContent>
    </Card>
  );
}
