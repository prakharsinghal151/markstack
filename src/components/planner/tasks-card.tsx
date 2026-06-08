"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isToday } from "date-fns";
import { CalendarDays } from "lucide-react";
import { TodoList, type Todo } from "./index";

interface TasksCardProps {
  selectedDate: Date;
  todos: Todo[];
  loading: boolean;
  onToggleTodo: (id: string, completed: boolean) => void;
  onDeleteTodo: (id: string) => void;
  className?: string;
}

export function TasksCard({
  selectedDate,
  todos,
  loading,
  onToggleTodo,
  onDeleteTodo,
  className,
}: TasksCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Tasks for {format(selectedDate, "EEEE, MMMM d")}
          {isToday(selectedDate) && <Badge variant="secondary">Today</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TodoList
          todos={todos}
          loading={loading}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          className="max-h-[500px]"
        />
      </CardContent>
    </Card>
  );
}
