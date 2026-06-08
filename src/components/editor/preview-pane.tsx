"use client";

import React from "react";
import { MDXRemote } from "next-mdx-remote";
import "highlight.js/styles/github-dark.css";
import type { SerializedMdx } from "@/lib/markdown/mdx-renderer";
import { MermaidComponent } from "./mermaid-component";

export interface MarkdownPreviewProps {
  content: SerializedMdx | null;
  isLoading?: boolean;
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

export function MarkdownPreview({ content, isLoading }: MarkdownPreviewProps) {
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Rendering preview...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-medium mb-2">Start writing</h3>
          <p className="text-sm text-muted-foreground">
            Type or paste markdown content to see a live preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-6 sm:p-8">
      <div
        className="prose prose-gray max-w-none dark:prose-invert
          prose-headings:font-semibold
          prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:leading-relaxed
          prose-code:font-mono
          prose-pre:overflow-x-auto
          prose-pre:rounded-lg prose-pre:bg-muted prose-pre:p-4
          text-[15px] leading-[1.7]"
      >
        <MDXRemote {...content} components={components} />
      </div>
    </div>
  );
}
