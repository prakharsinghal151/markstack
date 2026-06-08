import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppContainerProps {
  children: ReactNode;
  className?: string;
}

export function AppContainer({ children, className }: AppContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}
