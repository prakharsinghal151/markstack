"use client";

import { TodoItem, type Todo } from "./index";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  className?: string;
}

export function TodoList({
  todos,
  loading,
  onToggleTodo,
  onDeleteTodo,
  className,
}: TodoListProps) {
  return (
    <div className={`space-y-2 max-h-[400px] overflow-y-auto ${className}`}>
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading tasks...
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="space-y-2">
            <p className="text-lg font-medium">No tasks for this day.</p>
            <p className="text-sm">Start by adding one.</p>
          </div>
        </div>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
        ))
      )}
    </div>
  );
}
