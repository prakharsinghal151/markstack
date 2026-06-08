"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme
    >
      <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
