import "server-only";

import { randomUUID } from "crypto";
import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { Marked, Renderer, type Tokens } from "marked";
import hljs from "highlight.js";
import mermaid from "mermaid";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import type { Browser, Page } from "puppeteer-core";
import { buildBlogPdfHtml } from "./pdf-template";
import type { ExportableBlog } from "./types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveUrl(url: string, baseUrl: string) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function firstExistingPath(paths: Array<string | undefined>) {
  return paths.find(
    (candidate) => Boolean(candidate) && existsSync(candidate!),
  );
}

function resolveWindowsBrowserPath() {
  if (process.platform !== "win32") {
    return undefined;
  }

  const chromeCandidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    process.env.LOCALAPPDATA &&
      `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    process.env.PROGRAMFILES &&
      `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    process.env["PROGRAMFILES(X86)"] &&
      `${process.env["PROGRAMFILES(X86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
    process.env.LOCALAPPDATA &&
      `${process.env.LOCALAPPDATA}\\Microsoft\\Edge\\Application\\msedge.exe`,
    process.env.PROGRAMFILES &&
      `${process.env.PROGRAMFILES}\\Microsoft\\Edge\\Application\\msedge.exe`,
    process.env["PROGRAMFILES(X86)"] &&
      `${process.env["PROGRAMFILES(X86)"]}\\Microsoft\\Edge\\Application\\msedge.exe`,
  ];

  const existing = firstExistingPath(chromeCandidates);
  if (existing) {
    return existing;
  }

  const whereChrome = spawnSync("where", ["chrome"], { encoding: "utf8" });
  if (whereChrome.status === 0) {
    const candidate = whereChrome.stdout.split(/\r?\n/)[0]?.trim();
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  const whereEdge = spawnSync("where", ["msedge"], { encoding: "utf8" });
  if (whereEdge.status === 0) {
    const candidate = whereEdge.stdout.split(/\r?\n/)[0]?.trim();
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

async function resolveBrowserExecutablePath() {
  const envExecutablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    process.env.CHROME_PATH ||
    process.env.CHROMIUM_PATH;

  if (envExecutablePath) {
    return envExecutablePath;
  }

  if (process.platform === "win32") {
    const windowsExecutablePath = resolveWindowsBrowserPath();
    if (windowsExecutablePath) {
      return windowsExecutablePath;
    }

    return undefined;
  }

  try {
    const chromiumExecutablePath = await chromium.executablePath();
    if (chromiumExecutablePath) {
      return chromiumExecutablePath;
    }
  } catch {
    // Fall back to locally installed Chrome or Edge.
  }

  return undefined;
}

async function renderMermaidSvg(code: string) {
  try {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "neutral",
    });

    const id = `mermaid-${randomUUID().replace(/-/g, "")}`;
    const { svg } = await mermaid.render(id, code);
    return svg;
  } catch (error) {
    console.error("Failed to render mermaid diagram for PDF export:", error);
    return `<pre class="mermaid-fallback">${escapeHtml(code)}</pre>`;
  }
}

function createMarkdownRenderer(baseUrl: string) {
  const renderer = new Renderer();

  renderer.code = ({ text, lang }: Tokens.Code) => {
    const language = (lang || "").trim().toLowerCase();

    if (language === "mermaid") {
      const encoded = encodeURIComponent(text);
      return `<div class="mermaid-diagram" data-mermaid="${encoded}"></div>`;
    }

    const highlighted =
      language && hljs.getLanguage(language)
        ? hljs.highlight(text, { language }).value
        : escapeHtml(text);

    return `<pre><code class="language-${escapeHtml(language || "text")}">${highlighted}</code></pre>`;
  };

  renderer.html = ({ text }: Tokens.HTML) => escapeHtml(text);

  renderer.image = ({ href, title, text }: Tokens.Image) => {
    const resolvedSrc = resolveUrl(href, baseUrl);
    const alt = escapeHtml(text || "Image");
    const resolvedTitle = title ? ` title="${escapeHtml(title)}"` : "";

    return `<figure><img src="${escapeHtml(resolvedSrc)}" alt="${alt}"${resolvedTitle} /></figure>`;
  };

  renderer.link = ({ href, title, tokens }: Tokens.Link) => {
    const resolvedHref = resolveUrl(href, baseUrl);
    const label = tokens
      .map((token) =>
        token.type === "text" ? escapeHtml(token.text) : token.raw,
      )
      .join("");
    const resolvedTitle = title ? ` title="${escapeHtml(title)}"` : "";

    return `<a href="${escapeHtml(resolvedHref)}"${resolvedTitle} target="_blank" rel="noopener noreferrer">${label}</a>`;
  };

  return new Marked({
    gfm: true,
    breaks: false,
    renderer,
  });
}

async function replaceMermaidPlaceholders(html: string) {
  const matches = Array.from(
    html.matchAll(
      /<div class="mermaid-diagram" data-mermaid="([^"]+)"><\/div>/g,
    ),
  );

  if (matches.length === 0) {
    return html;
  }

  const rendered = await Promise.all(
    matches.map(async (match) => {
      const code = decodeURIComponent(match[1] ?? "");
      const svg = await renderMermaidSvg(code);
      return {
        placeholder: match[0],
        svg,
      };
    }),
  );

  return rendered.reduce(
    (output, item) => output.replace(item.placeholder, item.svg),
    html,
  );
}

async function renderMarkdownToHtml(markdown: string, baseUrl: string) {
  const parser = createMarkdownRenderer(baseUrl);
  const rawHtml = await parser.parse(markdown);
  return replaceMermaidPlaceholders(rawHtml);
}

async function launchBrowser(): Promise<Browser> {
  const executablePath = await resolveBrowserExecutablePath();

  if (!executablePath) {
    throw new Error(
      "No browser executable found for PDF export. Set PUPPETEER_EXECUTABLE_PATH or install Chrome/Edge.",
    );
  }

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1280,
      height: 1600,
      deviceScaleFactor: 1,
    },
    executablePath,
    headless: true,
  });
}

async function waitForImages(page: Page) {
  await page.waitForFunction(() => {
    return Array.from(document.images).every((image) => image.complete);
  });
}

export async function generateBlogPdfBuffer(
  blog: ExportableBlog,
  baseUrl: string,
) {
  const articleHtml = await renderMarkdownToHtml(blog.content, baseUrl);
  const html = buildBlogPdfHtml(blog, articleHtml, baseUrl);
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMediaType("screen");
    await waitForImages(page);
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return pdf;
  } finally {
    await browser.close();
  }
}
