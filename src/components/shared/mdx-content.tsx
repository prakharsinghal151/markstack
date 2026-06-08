"use client";

import React from "react";
import dynamic from "next/dynamic";
import "highlight.js/styles/github-dark.css";
import type { SerializedMdx } from "@/lib/markdown/mdx-renderer";
import { MermaidComponent } from "@/components/editor/mermaid-component";

const MDXRemote = dynamic(
  () => import("next-mdx-remote").then((mod) => mod.MDXRemote),
  {
    ssr: false,
    loading: () => <div>Loading content...</div>,
  },
);

export interface MDXContentProps {
  content: SerializedMdx | null;
}

const components = {
  code: (
    props: React.HTMLAttributes<HTMLElement> & {
      className?: string;
      children?: React.ReactNode;
    },
  ) => {
    const { className, children, ...rest } = props;

    // Handle Mermaid code blocks using data-mermaid attribute or className
    const isMermaid =
      (rest as any)["data-mermaid"] === "true" ||
      className === "language-mermaid";

    if (isMermaid && typeof children === "string") {
      return (
        <div className="not-prose">
          <MermaidComponent chart={children.trim()} />
        </div>
      );
    }

    return (
      <code className="bg-muted px-1 py-0.5 rounded text-sm" {...rest}>
        {children}
      </code>
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"
      {...props}
    />
  ),
};

export function MDXContent({ content }: MDXContentProps) {
  if (!content) return null;

  return <MDXRemote {...content} components={components} />;
}
