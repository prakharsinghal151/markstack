"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookText, FileText, Menu, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserMenu } from "@/components/shared/user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
}

const navigation = [
  {
    href: "/editor",
    label: "Editor",
    description: "Create and edit posts",
    icon: PenSquare,
  },
  {
    href: "/dashboard/blogs",
    label: "My Blogs",
    description: "Manage your posts",
    icon: BookText,
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-all duration-200 ease-in-out",
              isActive
                ? "border-border bg-card text-foreground shadow-xs"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-card/70 hover:text-foreground",
            )}
          >
            <Icon className="mt-0.5 size-4" />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium">{item.label}</span>
              <span className="block text-xs text-muted-foreground">
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const activeTitle = useMemo(() => {
    const match = navigation.find((item) => pathname.startsWith(item.href));
    return match?.label ?? "Dashboard";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card/70 p-4 backdrop-blur md:flex md:flex-col">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold"
          >
            <FileText className="size-4" />
            MarkStack
          </Link>
          <NavLinks />
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
              <Button
                variant="outline"
                size="icon-sm"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{activeTitle}</p>
              </div>
              <ThemeToggle />
              <UserMenu />
            </div>
          </header>

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
            {children}
          </main>
        </section>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-4">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="size-4" />
              MarkStack
            </SheetTitle>
            <SheetDescription>Navigate your workspace</SheetDescription>
          </SheetHeader>
          <NavLinks onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
