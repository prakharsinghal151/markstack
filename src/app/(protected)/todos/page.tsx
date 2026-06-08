"use client";

import { TodoCalendar } from "@/components/calendar/todo-calendar";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function TodosPage() {
  return (
    <AuthGuard>
      <TodoCalendar />
    </AuthGuard>
  );
}
