/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  LogOut,
  PenSquare,
  BookOpen,
  User,
  LayoutDashboard,
  CheckSquare,
  Palette,
  Settings,
} from "lucide-react";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function UserMenu() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await authClient.getSession();

        setUser(data?.user || null);
      } catch (_error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/auth");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getCallbackUrl = () =>
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/";

  const redirectToSignIn = () => {
    router.push(`/auth?callbackUrl=${encodeURIComponent(getCallbackUrl())}`);
  };

  const redirectToSignUp = () => {
    router.push(
      `/auth?tab=signup&callbackUrl=${encodeURIComponent(getCallbackUrl())}`,
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={redirectToSignIn}>
          Sign In
        </Button>
        <Button size="sm" onClick={redirectToSignUp}>
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative rounded-full border border-transparent hover:border-border"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? user.email ?? "User"}
              />
              <AvatarFallback>
                {user.name?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push("/dashboard/blogs")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>My Blogs</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/blogs")}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>All Blogs</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/todos")}>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Todos</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/canvases")}>
            <Palette className="mr-2 h-4 w-4" />
            <span>Canvas</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/editor")}>
            <PenSquare className="mr-2 h-4 w-4" />
            <span>New Post</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
