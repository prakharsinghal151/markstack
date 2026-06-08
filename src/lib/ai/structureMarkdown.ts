import { aiClient } from "@/config/ai-client";

interface StructureMarkdownOptions {
  apiKey?: string;
  model?: string;
}

export async function structureMarkdown(
  markdown: string,
  options: StructureMarkdownOptions = {},
): Promise<string> {
  if (!markdown || markdown.trim().length === 0) {
    throw new Error("Markdown content cannot be empty");
  }

  try {
    const structuredMarkdown = await aiClient.structureMarkdown(markdown);
    return structuredMarkdown;
  } catch (error) {
    console.error("Error structuring markdown:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to structure markdown: ${error.message}`);
    }

    throw new Error("Failed to structure markdown: Unknown error");
  }
}
