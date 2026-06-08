import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { rehypeMermaid } from "./rehype-mermaid";

export type SerializedMdx = {
  compiledSource: string;
  scope: Record<string, any>;
  frontmatter: Record<string, any>;
};

function preprocessMarkdown(content: string): string {
  // Normalize line endings
  let processed = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Collapse 3+ blank lines
  processed = processed.replace(/\n{3,}/g, "\n\n");

  // Auto-close unclosed code fences
  if ((processed.match(/```/g) ?? []).length % 2 !== 0) {
    processed += "\n```";
  }

  return processed;
}

const SERIALIZE_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeHighlight, rehypeMermaid],
    development: process.env.NODE_ENV === "development",
    // "md" format uses a standard markdown parser — no JSX layer.
    // "mdx" format chokes on pasted content that contains {}, <>, import/export, etc.
    format: "md" as const,
  },
  parseFrontmatter: false,
};

export async function serializeMDX(
  content: string,
): Promise<SerializedMdx | null> {
  try {
    return await serialize(preprocessMarkdown(content), SERIALIZE_OPTIONS);
  } catch {
    return null;
  }
}
