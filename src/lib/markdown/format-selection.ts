export type FormatType =
  | "bold"
  | "italic"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "bullet"
  | "numbered"
  | "quote"
  | "codeblock"
  | "divider"
  | "mermaid";

import type {
  EditorEdit,
  EditorInstance,
  EditorSelection,
} from "@/types/editor";

interface FormatConfig {
  prefix?: string;
  suffix?: string;
  multiline?: boolean;
  linePrefix?: string;
  toggleable?: boolean;
}

const FORMAT_CONFIGS: Record<FormatType, FormatConfig> = {
  bold: { prefix: "**", suffix: "**", toggleable: true },
  italic: { prefix: "*", suffix: "*", toggleable: true },
  code: { prefix: "`", suffix: "`", toggleable: true },
  h1: { prefix: "# ", toggleable: true },
  h2: { prefix: "## ", toggleable: true },
  h3: { prefix: "### ", toggleable: true },
  bullet: { linePrefix: "- ", multiline: true, toggleable: true },
  numbered: { linePrefix: "1. ", multiline: true, toggleable: true },
  quote: { prefix: "> ", toggleable: true },
  codeblock: { prefix: "```\n", suffix: "\n```", toggleable: true },
  divider: { prefix: "---\n" },
  mermaid: {
    prefix: "```mermaid\ngraph TD\n    A[Start] --> B[End]\n",
    suffix: "\n```",
    toggleable: true,
  },
};

export function applyMarkdownFormat(
  editor: EditorInstance,
  formatType: FormatType,
): void {
  const selection = editor.getSelection();
  const model = editor.getModel();

  if (!selection || !model) return;

  const config = FORMAT_CONFIGS[formatType];
  if (!config) return;

  // Get selected text or current line
  const selectedText = getSelectedText(editor, selection);

  if (config.toggleable && isAlreadyFormatted(selectedText, formatType)) {
    // Remove formatting
    removeFormatting(editor, selection, formatType);
  } else {
    // Apply formatting
    applyFormatting(editor, selection, formatType, config);
  }
}

function getSelectedText(
  editor: EditorInstance,
  selection: EditorSelection,
): string {
  const model = editor.getModel();
  if (!model) {
    return "";
  }

  if (selection.isEmpty()) {
    // No selection, get current line
    const lineNumber = selection.startLineNumber;
    return model.getLineContent(lineNumber);
  } else {
    // Has selection
    return model.getValueInRange(selection);
  }
}

function isAlreadyFormatted(text: string, formatType: FormatType): boolean {
  switch (formatType) {
    case "bold":
      return text.startsWith("**") && text.endsWith("**");
    case "italic":
      return (
        text.startsWith("*") && text.endsWith("*") && !text.startsWith("**")
      );
    case "code":
      return text.startsWith("`") && text.endsWith("`");
    case "h1":
      return text.startsWith("# ");
    case "h2":
      return text.startsWith("## ");
    case "h3":
      return text.startsWith("### ");
    case "quote":
      return text.startsWith("> ");
    case "bullet":
      return text.startsWith("- ");
    case "numbered":
      return /^\d+\.\s/.test(text);
    case "codeblock":
      return text.startsWith("```") && text.endsWith("```");
    case "mermaid":
      return text.includes("```mermaid") && text.endsWith("```");
    case "divider":
      return text.trim() === "---";
    default:
      return false;
  }
}

function removeFormatting(
  editor: EditorInstance,
  selection: EditorSelection,
  formatType: FormatType,
): void {
  const model = editor.getModel();
  if (!model) {
    return;
  }

  const text = model.getValueInRange(selection);
  let newText = text;

  switch (formatType) {
    case "bold":
      newText = text.replace(/^\*\*(.+?)\*\*$/, "$1");
      break;
    case "italic":
      newText = text.replace(/^\*(.+?)\*$/, "$1");
      break;
    case "code":
      newText = text.replace(/^`(.+?)`$/, "$1");
      break;
    case "h1":
      newText = text.replace(/^#\s/, "");
      break;
    case "h2":
      newText = text.replace(/^##\s/, "");
      break;
    case "h3":
      newText = text.replace(/^###\s/, "");
      break;
    case "quote":
      newText = text.replace(/^>\s/, "");
      break;
    case "bullet":
      newText = text.replace(/^-\s/, "");
      break;
    case "numbered":
      newText = text.replace(/^\d+\.\s/, "");
      break;
    case "codeblock":
      newText = text.replace(/^```[\w]*\n([\s\S]*?)\n```$/, "$1");
      break;
    case "mermaid":
      newText = text.replace(/^```mermaid\n([\s\S]*?)\n```$/, "$1");
      break;
    case "divider":
      newText = "";
      break;
  }

  // Apply the edit
  editor.executeEdits("", [
    {
      range: selection,
      text: newText,
      forceMoveMarkers: true,
    },
  ]);
}

function applyFormatting(
  editor: EditorInstance,
  selection: EditorSelection,
  formatType: FormatType,
  config: FormatConfig,
): void {
  if (selection.isEmpty()) {
    // No selection - insert at cursor position
    insertAtCursor(editor, selection, config);
  } else {
    // Has selection - wrap or prefix lines
    if (config.multiline) {
      applyMultiLineFormatting(editor, selection, config, formatType);
    } else {
      applySingleFormatting(editor, selection, config);
    }
  }
}

function insertAtCursor(
  editor: EditorInstance,
  selection: EditorSelection,
  config: FormatConfig,
): void {
  const position = selection.getPosition();
  let text = "";

  if (config.linePrefix) {
    text = config.linePrefix;
  } else if (config.prefix && config.suffix) {
    text = config.prefix + config.suffix;
    // Position cursor in the middle
    const newPosition = {
      lineNumber: position.lineNumber,
      column: position.column + config.prefix.length,
    };
    editor.setPosition(newPosition);
  } else {
    text = config.prefix || "";
  }

  editor.executeEdits("", [
    {
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      },
      text,
      forceMoveMarkers: true,
    },
  ]);
}

function applySingleFormatting(
  editor: EditorInstance,
  selection: EditorSelection,
  config: FormatConfig,
): void {
  const model = editor.getModel();
  if (!model) {
    return;
  }

  const selectedText = model.getValueInRange(selection);
  const newText = config.prefix + selectedText + (config.suffix || "");

  editor.executeEdits("", [
    {
      range: selection,
      text: newText,
      forceMoveMarkers: true,
    },
  ]);
}

function applyMultiLineFormatting(
  editor: EditorInstance,
  selection: EditorSelection,
  config: FormatConfig,
  formatType: FormatType,
): void {
  const model = editor.getModel();
  if (!model) {
    return;
  }

  const startLine = selection.startLineNumber;
  const endLine = selection.endLineNumber;

  // Process each line
  const edits: EditorEdit[] = [];

  for (let lineNum = startLine; lineNum <= endLine; lineNum++) {
    const lineContent = model.getLineContent(lineNum);
    let newLineContent: string;

    if (config.linePrefix) {
      // For lists, check if already formatted
      if (formatType === "numbered" && /^\d+\.\s/.test(lineContent)) {
        newLineContent = lineContent.replace(/^\d+\.\s/, "");
      } else if (formatType === "bullet" && lineContent.startsWith("- ")) {
        newLineContent = lineContent.replace(/^-\s/, "");
      } else {
        newLineContent = config.linePrefix + lineContent;
      }
    } else {
      newLineContent = config.prefix + lineContent + (config.suffix || "");
    }

    edits.push({
      range: {
        startLineNumber: lineNum,
        startColumn: 1,
        endLineNumber: lineNum,
        endColumn: lineContent.length + 1,
      },
      text: newLineContent,
      forceMoveMarkers: true,
    });
  }

  editor.executeEdits("", edits);
}
