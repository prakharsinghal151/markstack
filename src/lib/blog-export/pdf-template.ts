import "server-only";

import type { ExportableBlog } from "./types";

export function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function resolveAssetUrl(assetPath: string | null, baseUrl: string) {
  if (!assetPath) {
    return null;
  }

  try {
    return new URL(assetPath, baseUrl).toString();
  } catch {
    return assetPath;
  }
}

export function buildBlogPdfHtml(
  blog: ExportableBlog,
  articleHtml: string,
  baseUrl: string,
) {
  const coverImageUrl = resolveAssetUrl(blog.coverImage, baseUrl);
  const authorName = blog.author.name || blog.author.email;
  const publishedDate = formatBlogDate(blog.createdAt);
  const readTime = blog.readTime
    ? `${blog.readTime} min read`
    : "Reading time unavailable";
  const title = escapeHtml(blog.title);
  const description = blog.description ? escapeHtml(blog.description) : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: light;
        --text: #111827;
        --muted: #6b7280;
        --border: #e5e7eb;
        --surface: #ffffff;
        --surface-muted: #f9fafb;
        --accent: #111827;
        --code-fg: #111827;
        --code-keyword: #2563eb;
        --code-string: #059669;
        --code-number: #b45309;
        --code-title: #7c3aed;
        --code-comment: #6b7280;
      }

      @page {
        margin: 18mm 16mm 20mm;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: var(--surface);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 14px;
        line-height: 1.7;
      }

      body {
        padding: 0;
      }

      .page {
        max-width: 896px;
        margin: 0 auto;
      }

      .hero {
        padding: 0 0 24px;
        border-bottom: 1px solid var(--border);
        margin-bottom: 28px;
      }

      .badge-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 3px 10px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0;
        color: var(--muted);
        background: var(--surface-muted);
      }

      h1 {
        margin: 14px 0 12px;
        font-size: 2.25rem;
        line-height: 1.12;
        letter-spacing: -0.04em;
        font-weight: 600;
      }

      .description {
        margin: 0 0 18px;
        font-size: 1rem;
        line-height: 1.75;
        color: var(--muted);
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 16px;
        color: var(--muted);
        font-size: 0.9rem;
      }

      .meta-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .cover {
        margin: 24px 0 0;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid var(--border);
        background: var(--surface-muted);
      }

      .cover img {
        display: block;
        width: 100%;
        height: auto;
      }

      .content {
        font-size: 14px;
        line-height: 1.75;
      }

      .content :is(h1, h2, h3, h4, h5, h6) {
        color: var(--text);
        letter-spacing: -0.03em;
        line-height: 1.2;
        margin: 1.6em 0 0.6em;
        break-after: avoid;
        page-break-after: avoid;
      }

      .content h1 { font-size: 1.5rem; }
      .content h2 { font-size: 1.25rem; }
      .content h3 { font-size: 1.1rem; }
      .content h4 { font-size: 1rem; }

      .content p,
      .content ul,
      .content ol,
      .content blockquote,
      .content table,
      .content pre,
      .content figure {
        margin: 0 0 1.1em;
      }

      .content a {
        color: var(--accent);
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      .content img {
        max-width: 100%;
        height: auto;
      }

      .content blockquote {
        padding: 0.25rem 1rem;
        border-left: 2px solid #d1d5db;
        color: var(--muted);
        background: var(--surface-muted);
        border-radius: 0 12px 12px 0;
      }

      .content table {
        width: 100%;
        border-collapse: collapse;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 14px;
      }

      .content thead {
        background: var(--surface-muted);
      }

      .content th,
      .content td {
        padding: 0.75rem 0.875rem;
        border-bottom: 1px solid var(--border);
        text-align: left;
        vertical-align: top;
      }

      .content tr:last-child td {
        border-bottom: 0;
      }

      .content pre {
        background: var(--surface-muted);
        color: var(--code-fg);
        border-radius: 12px;
        padding: 1rem 1.1rem;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        break-inside: avoid;
        page-break-inside: avoid;
        border: 1px solid var(--border);
      }

      .content pre code {
        font-family: "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
        font-size: 0.88rem;
      }

      .content :not(pre) > code {
        font-family: "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
        font-size: 0.85em;
        background: var(--surface-muted);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 0.1rem 0.35rem;
      }

      .content .hljs-comment,
      .content .hljs-quote {
        color: var(--code-comment);
      }

      .content .hljs-keyword,
      .content .hljs-selector-tag,
      .content .hljs-title,
      .content .hljs-section {
        color: var(--code-keyword);
      }

      .content .hljs-string,
      .content .hljs-regexp,
      .content .hljs-addition {
        color: var(--code-string);
      }

      .content .hljs-number,
      .content .hljs-literal,
      .content .hljs-symbol,
      .content .hljs-bullet {
        color: var(--code-number);
      }

      .content .hljs-function,
      .content .hljs-built_in,
      .content .hljs-attribute,
      .content .hljs-name {
        color: var(--code-title);
      }

      .content .hljs {
        background: transparent;
        color: inherit;
      }

      .content pre code,
      .content code {
        color: inherit;
      }

      .mermaid-diagram {
        break-inside: avoid;
        page-break-inside: avoid;
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid var(--border);
        border-radius: 16px;
        background: var(--surface-muted);
        overflow: hidden;
      }

      .mermaid-diagram svg {
        width: 100% !important;
        height: auto !important;
      }

      img, pre, table, .mermaid-diagram, blockquote {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    </style>
  </head>
  <body>
    <main class="page">
      <section class="hero">
        <div class="badge-row">
          <span class="badge">Blog Post</span>
          <span class="badge">PDF Export</span>
        </div>
        <h1>${title}</h1>
        ${description ? `<p class="description">${description}</p>` : ""}
        <div class="meta">
          <span class="meta-item">Author: <strong>${escapeHtml(authorName)}</strong></span>
          <span class="meta-item">Read time: <strong>${escapeHtml(readTime)}</strong></span>
          <span class="meta-item">Published: <strong>${escapeHtml(publishedDate)}</strong></span>
        </div>
        ${coverImageUrl ? `<div class="cover"><img src="${escapeHtml(coverImageUrl)}" alt="${title} cover image" /></div>` : ""}
      </section>

      <article class="content">
        ${articleHtml}
      </article>
    </main>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
