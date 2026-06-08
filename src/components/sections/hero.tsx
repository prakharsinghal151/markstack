"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AppContainer } from "@/components/layout/app-container";

export function Hero() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session.data);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleStartWriting = () => {
    if (isAuthenticated) {
      router.push("/editor");
    } else {
      router.push("/auth?callbackUrl=/editor");
    }
  };

  const handleBrowseContent = () => {
    router.push("/blogs");
  };

  return (
    <section className="pt-20 pb-16 relative">
      <AppContainer>
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-secondary px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-secondary-foreground border border-border">
              Built for Dev's
            </span>
            <div className="h-[1px] w-12 bg-border" />
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[0.9] mb-8">
            Create, write, and <br /> organize all in one workspace.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
            A unified environment for writing, visual thinking, and structured
            planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              className="h-10 w-full gap-2 px-5 transition-all duration-200 ease-in-out sm:w-auto"
              onClick={handleStartWriting}
              disabled={isAuthenticated === null}
            >
              Start Writing
              <ArrowRight className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-10 w-full px-5 sm:w-auto"
              onClick={handleBrowseContent}
            >
              Browse Content
            </Button>
          </div>
        </div>
      </AppContainer>
    </section>
  );
}
