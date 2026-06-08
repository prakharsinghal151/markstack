"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        const authenticated = !!session.data;
        setIsAuthenticated(authenticated);
        
        if (!authenticated && requireAuth) {
          // Redirect to auth page with callback
          const callbackUrl = encodeURIComponent(pathname);
          router.push(`/auth?callbackUrl=${callbackUrl}`);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router, pathname, requireAuth]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and auth is required, show nothing (redirect will happen)
  if (!isAuthenticated && requireAuth) {
    return null;
  }

  // If authenticated or auth not required, show children
  return <>{children}</>;
}
