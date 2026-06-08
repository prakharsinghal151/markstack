"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfDay } from "date-fns";
import {
  CalendarPanel,
  AddTaskCard,
  TasksCard,
  type Todo,
} from "@/components/planner";

interface TodoCalendarProps {
  className?: string;
}

export function TodoCalendar({ className }: TodoCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [datesWithTodos, setDatesWithTodos] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch todos for selected date
  const fetchTodosForDate = useCallback(async (date: Date) => {
    setLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const response = await fetch(`/api/todos?date=${dateStr}`);
      if (!response.ok) throw new Error("Failed to fetch todos");

      const data = await response.json();
      setTodos(
        data.todos.map((todo: any) => ({
          ...todo,
          date: todo.date, // Keep as string
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        })),
      );
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch dates with todos for current month
  const fetchMonthTodos = useCallback(async (date: Date) => {
    try {
      const monthStr = format(date, "yyyy-MM");
      const response = await fetch(`/api/todos/month?month=${monthStr}`);
      if (!response.ok) throw new Error("Failed to fetch month todos");

      const data = await response.json();
      setDatesWithTodos(new Set(data.datesWithTodos));
    } catch (error) {
      console.error("Error fetching month todos:", error);
    }
  }, []);

  // Load todos when selected date changes
  useEffect(() => {
    fetchTodosForDate(selectedDate);
  }, [selectedDate, fetchTodosForDate]);

  // Load month todos when component mounts or selected date changes month
  useEffect(() => {
    fetchMonthTodos(selectedDate);
  }, [selectedDate, fetchMonthTodos]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Add new todo
  const handleAddTodo = async (title: string, description?: string) => {
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          date: dateStr, // Send as YYYY-MM-DD string
        }),
      });

      if (!response.ok) throw new Error("Failed to create todo");

      const newTodo = await response.json();
      setTodos((prev) => [
        ...prev,
        {
          ...newTodo.todo,
          date: newTodo.todo.date, // Keep as string
          createdAt: new Date(newTodo.todo.createdAt),
          updatedAt: new Date(newTodo.todo.updatedAt),
        },
      ]);

      // Update dates with todos
      setDatesWithTodos((prev) => new Set([...prev, dateStr]));
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Toggle todo completion
  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      // Refetch todos to ensure UI is in sync
      await fetchTodosForDate(selectedDate);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (todoId: string) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete todo");

      // Refetch todos and month data to ensure UI is in sync
      await fetchTodosForDate(selectedDate);
      await fetchMonthTodos(selectedDate);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 sm:gap-6 h-full p-2 sm:p-4 ${className}`}
    >
      {/* Top Controls Section */}
      <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6">
        {/* Calendar Card */}
        <div className="h-full">
          <CalendarPanel
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            datesWithTodos={datesWithTodos}
          />
        </div>

        {/* Add Task Card */}
        <div className="h-full flex flex-col">
          <AddTaskCard selectedDate={selectedDate} onAddTodo={handleAddTodo} />
        </div>
      </div>

      {/* Bottom Tasks Section */}
      <div className="flex-1">
        <TasksCard
          selectedDate={selectedDate}
          todos={todos}
          loading={loading}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      </div>
    </div>
  );
}
