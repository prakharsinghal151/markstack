"use client";

import { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import {
  ThemeAnimationType,
  useModeAnimation,
} from "react-theme-switch-animation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

type ThemeOption = (typeof themeOptions)[number]["value"];

export function ThemeToggle({ className }: { className?: string }) {
  const pendingThemeRef = useRef<ThemeOption | null>(null);
  const { resolvedTheme, setTheme, theme } = useTheme();
  const currentTheme = theme ?? "light";
  const effectiveTheme = resolvedTheme ?? "light";
  const { ref, toggleSwitchTheme } = useModeAnimation({
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    blurAmount: 3,
    duration: 700,
    isDarkMode: effectiveTheme === "dark",
    onDarkModeChange: (nextIsDarkMode) => {
      const pendingTheme = pendingThemeRef.current;

      pendingThemeRef.current = null;

      if (pendingTheme) {
        setTheme(pendingTheme);
        return;
      }

      setTheme(nextIsDarkMode ? "dark" : "light");
    },
    styleId: "markstack-theme-switch",
  });

  const handleThemeChange = async (nextTheme: ThemeOption) => {
    if (nextTheme === currentTheme) {
      return;
    }

    if (nextTheme === effectiveTheme) {
      pendingThemeRef.current = null;
      setTheme(nextTheme);
      return;
    }

    pendingThemeRef.current = nextTheme;
    await toggleSwitchTheme();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          size="icon-sm"
          className={cn(
            "relative shrink-0 transition-all duration-200 ease-in-out",
            className,
          )}
          aria-label="Change theme"
        >
          <Sun className="size-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentTheme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                void handleThemeChange(option.value);
              }}
              className="gap-2"
            >
              <Icon className="size-4" />
              <span>{option.label}</span>
              {isActive && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Active
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
