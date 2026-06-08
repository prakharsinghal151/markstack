"use client";

import { useBlogs } from "@/hooks/use-blogs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Plus,
  Clock3,
  Send,
  FileX,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ProtectedPageWrapper } from "@/components/layout/protected-page-wrapper";

export default function DashboardBlogsPage() {
  const { blogs, loading, error, deleteBlog, publishBlog, unpublishBlog } =
    useBlogs();

  if (loading) {
    return (
      <ProtectedPageWrapper>
        <PageSkeleton cardCount={6} gridCols="3" />
      </ProtectedPageWrapper>
    );
  }

  if (error) {
    return (
      <ProtectedPageWrapper>
        <Card className="mx-auto max-w-xl border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle>Unable to load your blogs</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </ProtectedPageWrapper>
    );
  }

  return (
    <ProtectedPageWrapper
      title="My blogs"
      description="Manage your posts in one place."
      actions={
        <Link href="/editor" className="w-full sm:w-auto">
          <Button className="h-10 w-full gap-2 sm:w-auto">
            <Plus className="size-4" />
            New blog
          </Button>
        </Link>
      }
    >
      {blogs.length === 0 ? (
        <Card className="border-dashed border-border/80 bg-card/60">
          <CardContent className="py-14 text-center">
            <h3 className="text-lg font-medium">No blogs yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Create your first post to start building your writing archive.
            </p>
            <Link href="/editor">
              <Button className="mt-6">Create your first blog</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="flex h-full flex-col overflow-hidden border-border/80 bg-card/70 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-2">
                    <CardTitle className="line-clamp-2 text-lg font-semibold tracking-tight">
                      {blog.title}
                    </CardTitle>
                    <div className="flex min-w-0 items-center gap-2">
                      <Badge
                        className="shrink-0"
                        variant={
                          blog.status === "published" ? "default" : "secondary"
                        }
                      >
                        {blog.status === "published" ? "Published" : "Draft"}
                      </Badge>
                      <CardDescription className="min-w-0 flex-1 break-all text-xs">
                        /{blog.slug}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/editor/${blog.id}`} className="gap-2">
                          <Edit className="size-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      {blog.status === "draft" ? (
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => publishBlog(blog.id)}
                        >
                          <Send className="size-4" />
                          Publish
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="gap-2"
                          onClick={() => unpublishBlog(blog.id)}
                        >
                          <FileX className="size-4" />
                          Unpublish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onClick={() => deleteBlog(blog.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {blog.description || "No description added yet."}
                </p>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5 shrink-0" />
                  Updated{" "}
                  {formatDistanceToNow(new Date(blog.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/editor/${blog.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Edit className="size-4" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/blogs/${blog.slug}`} className="flex-1">
                    <Button className="w-full gap-2">
                      <Eye className="size-4" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ProtectedPageWrapper>
  );
}
