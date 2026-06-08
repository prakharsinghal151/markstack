import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MDXContent } from "@/components/shared/mdx-content";
import { BlogShareButtons } from "@/components/shared/blog-share-buttons";
import { BlogExportMenu } from "@/components/blog/blog-export-menu";
import db from "@/lib/database";
import { getCurrentUser } from "@/lib/auth-utils";
import { serializeMDX } from "@/lib/markdown/mdx-renderer";
import { calculateReadTime } from "@/lib/markdown/read-time";

async function getBlogPost(slug: string, authorId?: string) {
  const blog = await db.blog.findFirst({
    where: {
      slug,
      OR: [
        { status: "published" },
        ...(authorId ? [{ authorId, status: "draft" }] : []),
      ],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      content: true,
      coverImage: true,
      readTime: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return blog;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const currentUser = await getCurrentUser();
  const post = await getBlogPost(slug, currentUser?.id);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const readingTime = post.readTime ?? calculateReadTime(post.content);
  const renderedContent = await serializeMDX(post.content);

  const isDraftPreview = post.status === "draft";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <header className="mb-8 space-y-4 sm:mb-10 sm:space-y-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 text-xs"
                >
                  Blog Post
                </Badge>

                {isDraftPreview && (
                  <Badge
                    variant="outline"
                    className="rounded-md border-amber-500/40 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400"
                  >
                    Draft
                  </Badge>
                )}

                <div className="flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5 shrink-0" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                  {post.title}
                </h1>

                {post.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {post.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5 shrink-0" />
                  <span className="max-w-[160px] truncate sm:max-w-none">
                    {post.author.name || post.author.email}
                  </span>
                </span>

                <span
                  className="text-muted-foreground/40 hidden sm:inline"
                  aria-hidden
                >
                  ·
                </span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 shrink-0" />
                  <time dateTime={post.createdAt.toString()}>
                    {formatDate(post.createdAt.toString())}
                  </time>
                </span>

                {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                  <>
                    <span
                      className="text-muted-foreground/40 hidden sm:inline"
                      aria-hidden
                    >
                      ·
                    </span>
                    <span className="flex items-center gap-1">
                      <span>Updated</span>
                      <time dateTime={post.updatedAt.toString()}>
                        {formatDate(post.updatedAt.toString())}
                      </time>
                    </span>
                  </>
                )}
              </div>
            </div>

            {currentUser?.id === post.authorId && (
              <div className="flex shrink-0 items-start sm:pt-1">
                <BlogExportMenu blogId={post.id} slug={post.slug} />
              </div>
            )}
          </div>

          <Separator />
        </header>

        <main
          className={[
            "prose prose-gray dark:prose-invert",
            // ── Base size
            "prose-sm sm:prose-base",
            // ── Headings
            "prose-headings:font-semibold prose-headings:tracking-tight",
            "prose-h1:text-xl sm:prose-h1:text-2xl",
            "prose-h2:text-lg sm:prose-h2:text-xl",
            "prose-h3:text-base sm:prose-h3:text-lg",
            // ── Body
            "prose-p:leading-relaxed",
            // ── Code blocks
            "prose-pre:overflow-x-auto prose-pre:rounded-lg",
            "prose-pre:bg-muted prose-pre:p-3 sm:prose-pre:p-4",
            "prose-pre:text-[13px] sm:prose-pre:text-sm",
            "prose-code:break-words",
            // ── Images — never overflow, always responsive
            "prose-img:w-full prose-img:h-auto prose-img:rounded-lg",
            "prose-img:mx-auto",
            // ── Tables — horizontal scroll on overflow
            "[&_table]:block [&_table]:w-full [&_table]:overflow-x-auto",
            "[&_table]:rounded-lg [&_table]:border [&_table]:border-border",
            // ── Blockquote
            "prose-blockquote:border-l-2 prose-blockquote:border-primary/40",
            "prose-blockquote:pl-4 prose-blockquote:italic",
            // ── Links
            "prose-a:text-primary prose-a:underline-offset-4",
            // ── Lists
            "prose-li:my-0.5",
            // ── Max width — let the container handle it
            "max-w-none",
          ].join(" ")}
        >
          <MDXContent content={renderedContent} />
        </main>

        {/* ── FOOTER ──────────────────────────────────────────────────── */}
        <footer className="mt-10 border-t pt-6 sm:mt-12 sm:pt-8">
          {/*
            Mobile:  stack share section above CTA button
            Desktop: side-by-side with space-between
          */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Share section */}
            <div className="min-w-0">
              <p className="mb-2.5 text-sm text-muted-foreground">
                Enjoyed this post? Share it!
              </p>
              <BlogShareButtons
                title={post.title}
                description={post.description}
              />
            </div>

            {/* CTA — full-width on mobile, auto-width on desktop */}
            <div className="shrink-0">
              <Link href="/editor" className="block w-full sm:w-auto">
                <Button className="w-full gap-2 sm:w-auto" size="default">
                  Write New Post
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
