import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PageSkeletonProps {
  title?: boolean;
  description?: boolean;
  cardCount?: number;
  gridCols?: "1" | "2" | "3";
}

export function PageSkeleton({ 
  title = true, 
  description = true, 
  cardCount = 6,
  gridCols = "3"
}: PageSkeletonProps) {
  const gridColsClass = {
    "1": "grid-cols-1",
    "2": "md:grid-cols-2",
    "3": "md:grid-cols-2 xl:grid-cols-3"
  }[gridCols];

  return (
    <div className="space-y-6">
      {title && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          {description && <Skeleton className="h-4 w-64" />}
        </div>
      )}
      
      <div className={`grid gap-4 ${gridColsClass}`}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <Card
            key={index}
            className="border-border/20 bg-card/70 shadow-sm"
          >
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
