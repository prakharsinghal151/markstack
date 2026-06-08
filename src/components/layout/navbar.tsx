"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { UserMenu } from "@/components/shared/user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { PUBLIC_NAV_LINKS, NAVIGATION_CONFIG } from "@/config/navigation";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session.data);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const publicLinks = PUBLIC_NAV_LINKS.filter(
    (link) => link.title !== "My Blogs",
  );

  const navLinks = isAuthenticated
    ? [
        ...publicLinks.slice(0, 3),
        NAVIGATION_CONFIG[1].items.find((item) => item.title === "My Blogs")!,
      ]
    : publicLinks.slice(0, 4);

  return (
    <header
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl 
    bg-card/95 backdrop-blur-lg border border-border 
    rounded-md px-2 sm:px-4 md:px-6 
    py-2 flex items-center justify-between 
    z-50 shadow-lg"
    >
      {/* Left section */}
      <div className="flex items-center gap-3 md:gap-6 min-w-0">
        <Link
          href="/"
          className="text-sm sm:text-base md:text-lg font-semibold whitespace-nowrap"
        >
          MarkStack
        </Link>

        {/* nav links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm">
          {navLinks.map((item, i) => (
            <Link
              key={item.url}
              href={item.url}
              className={`whitespace-nowrap transition ${
                i === 0
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
