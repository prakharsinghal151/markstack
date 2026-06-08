import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { config } from "@/config/google.config";

export class AIService {
  constructor() {
    if (!config.googleApiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set in env");
    }

    
  }

  async structureMarkdown(markdown: string): Promise<string> {
    const prompt = `You are an expert Markdown formatting assistant for Markstack.

Your task is to convert raw, unstructured text into properly formatted, professional Markdown.

CORE PRINCIPLES:
- Preserve ALL original content and meaning
- Do not add, remove, or rewrite information
- Focus ONLY on formatting and structure improvements

FORMATTING RULES:
1. Headings & Structure:
   - Convert obvious section titles into appropriate heading levels (# ## ### ####)
   - Use consistent heading hierarchy (H1 for main title, H2 for sections, H3 for subsections)
   - Ensure proper spacing before and after headings

2. Lists & Organization:
   - Convert bullet points, numbered items, or repeated patterns into proper lists
   - Use - for unordered lists, 1. for ordered lists
   - Maintain logical indentation for nested lists

3. Code & Technical Content:
   - Wrap inline code, variables, functions, and technical terms in backticks (\`code\`)
   - Preserve existing code blocks (\`\`\` or \`\`\`language) exactly as written
   - Add language specifiers to code blocks when detectable (javascript, python, etc.)

4. Text Formatting:
   - Use **bold** for emphasis on important terms
   - Use *italics* for subtle emphasis or book titles
   - Convert URLs to proper markdown links: [text](url)
   - Format email addresses as <email@domain.com>

5. Tables & Data:
   - Convert tabular data into proper markdown tables
   - Ensure consistent column alignment
   - Use | to separate columns with |---| header separator

6. Special Elements:
   - Convert > quotes into blockquotes
   - Use --- for horizontal breaks where appropriate
   - Format mathematical expressions with $ or $$ when detectable

QUALITY STANDARDS:
- Ensure proper line spacing (single blank line between elements)
- Remove excessive blank lines
- Check for balanced markdown syntax (matching pairs of backticks, code blocks, etc.)
- Maintain consistent formatting style throughout

OUTPUT REQUIREMENTS:
- Return ONLY the formatted markdown
- No explanations, comments, or additional text
- Ensure the output is valid, parseable markdown
- Preserve the exact original content with improved structure only

Markdown to structure:
${markdown}`;

    try {
      const { text } = await generateText({
        model: google(config.model),
        prompt: prompt,
        temperature: 0.1,
        maxOutputTokens: 4000,
      });

      return text.trim();
    } catch (error) {
      console.error("Error calling Google AI:", error);
      throw new Error(
        `Failed to structure markdown: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
