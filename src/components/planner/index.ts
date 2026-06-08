export { CalendarPanel } from "./calendar-panel";
export { TodoPanel } from "./todo-panel";
export { AddTaskCard } from "./add-task-card";
export { TasksCard } from "./tasks-card";
export { TodoForm } from "./todo-form";
export { TodoList } from "./todo-list";
export { TodoItem } from "./todo-item";

// Re-export Todo type inline to avoid circular dependencies
export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string; // Store as YYYY-MM-DD string
  createdAt: Date;
  updatedAt: Date;
};
