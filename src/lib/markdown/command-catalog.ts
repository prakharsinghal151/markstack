export interface SlashCommandDefinition {
  id: string;
  label: string;
  description: string;
  syntax: string;
}

export interface ToolbarCommandDefinition {
  label: string;
  syntax: string;
}

interface MarkdownCommandDefinition {
  label: string;
  description: string;
  toolbarSyntax?: string;
  slashId?: string;
  slashSyntax?: string;
}

const COMMAND_DEFINITIONS: readonly MarkdownCommandDefinition[] = [
  {
    label: "Heading 1",
    description: "Large heading",
    toolbarSyntax: "h1",
    slashId: "h1",
    slashSyntax: "# Heading",
  },
  {
    label: "Heading 2",
    description: "Medium heading",
    toolbarSyntax: "h2",
    slashId: "h2",
    slashSyntax: "## Heading",
  },
  {
    label: "Heading 3",
    description: "Small heading",
    toolbarSyntax: "h3",
    slashId: "h3",
    slashSyntax: "### Heading",
  },
  {
    label: "Bold",
    description: "Bold text",
    toolbarSyntax: "bold",
    slashId: "bold",
    slashSyntax: "**Bold text**",
  },
  {
    label: "Italic",
    description: "Italic text",
    toolbarSyntax: "italic",
    slashId: "italic",
    slashSyntax: "*Italic text*",
  },
  {
    label: "Inline Code",
    description: "Inline code",
    toolbarSyntax: "code",
  },
  {
    label: "Code Block",
    description: "Add a code block",
    toolbarSyntax: "codeblock",
    slashId: "code",
    slashSyntax: "```\ncode\n```",
  },
  {
    label: "Mermaid Diagram",
    description: "Add a Mermaid diagram",
    toolbarSyntax: "mermaid",
    slashId: "mermaid",
    slashSyntax: "```mermaid\ngraph TD\n    A[Start] --> B[End]\n```",
  },
  {
    label: "Bullet List",
    description: "Create a bullet list",
    toolbarSyntax: "bullet",
    slashId: "bullet",
    slashSyntax: "- List item",
  },
  {
    label: "Numbered List",
    description: "Create a numbered list",
    toolbarSyntax: "numbered",
    slashId: "numbered",
    slashSyntax: "1. List item",
  },
  {
    label: "Quote",
    description: "Add a quote",
    toolbarSyntax: "quote",
    slashId: "quote",
    slashSyntax: "> Quote",
  },
  {
    label: "Divider",
    description: "Add a horizontal divider",
    toolbarSyntax: "divider",
    slashId: "divider",
    slashSyntax: "---",
  },
  {
    label: "Link",
    description: "Add a link",
    slashId: "link",
    slashSyntax: "[Link text](url)",
  },
];

export const toolbarCommandDefinitions: ToolbarCommandDefinition[] =
  COMMAND_DEFINITIONS.filter(
    (
      command,
    ): command is MarkdownCommandDefinition & { toolbarSyntax: string } =>
      typeof command.toolbarSyntax === "string",
  ).map((command) => ({
    label: command.label,
    syntax: command.toolbarSyntax,
  }));

export const slashCommandDefinitions: SlashCommandDefinition[] =
  COMMAND_DEFINITIONS.filter(
    (
      command,
    ): command is MarkdownCommandDefinition & {
      slashId: string;
      slashSyntax: string;
    } =>
      typeof command.slashId === "string" &&
      typeof command.slashSyntax === "string",
  ).map((command) => ({
    id: command.slashId,
    label: command.label,
    description: command.description,
    syntax: command.slashSyntax,
  }));
