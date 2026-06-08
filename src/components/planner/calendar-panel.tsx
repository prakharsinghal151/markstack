"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface CalendarPanelProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  datesWithTodos: Set<string>;
  className?: string;
}

export function CalendarPanel({
  selectedDate,
  onDateSelect,
  datesWithTodos,
  className,
}: CalendarPanelProps) {
  // Custom modifier for dates with todos
  const modifiers = {
    hasTodos: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return datesWithTodos.has(dateStr);
    },
  };

  const modifiersStyles = {
    hasTodos: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      borderRadius: "50%",
    },
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />
      </CardContent>
    </Card>
  );
}
