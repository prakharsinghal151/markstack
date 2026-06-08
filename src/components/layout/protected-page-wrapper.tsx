import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProtectedPageWrapperProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export function ProtectedPageWrapper({
  children,
  className,
  title,
  description,
  actions,
}: ProtectedPageWrapperProps) {
  return (
    <div className={cn("px-4 sm:px-6 py-6 max-w-screen-xl mx-auto", className)}>
      {(title || description || actions) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex-shrink-0 sm:ml-4">{actions}</div>}
        </div>
      )}
      <div className="space-y-6">{children}</div>
    </div>
  );
}
