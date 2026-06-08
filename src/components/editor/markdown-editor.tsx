"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useSlashCommands } from "@/hooks/use-slash-commands";
import type { EditorInstance } from "@/types/editor";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onEditorReady: (editor: EditorInstance) => void;
}

export function MarkdownEditor({
  value,
  onChange,
  onEditorReady,
}: MarkdownEditorProps) {
  const editorRef = useRef<EditorInstance | null>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    isOpen,
    position,
    selectedIndex,
    filteredCommands,
    setFilter,
    openMenu,
    closeMenu,
    selectCommand,
  } = useSlashCommands(editorRef);

  const handleEditorDidMount = useCallback(
    (editor: EditorInstance, monaco: Monaco) => {
      editorRef.current = editor;
      onEditorReady(editor);

      const modelForLanguage = editor.getModel();
      if (modelForLanguage) {
        monaco.editor.setModelLanguage(modelForLanguage, "markdown");
      }

      editor.onDidChangeModelContent(() => {
        // Force onChange callback to ensure preview updates
        const currentValue = editor.getValue();
        onChange(currentValue);

        const position = editor.getPosition();
        if (!position) {
          return;
        }

        const model = editor.getModel();
        if (!model) {
          return;
        }

        const lineContent = model.getLineContent(position.lineNumber);
        const cursorColumn = position.column;

        const beforeCursor = lineContent.slice(0, cursorColumn - 1);
        const slashMatch = beforeCursor.match(/\/([a-zA-Z]*)$/);

        if (slashMatch) {
          const slashStart = cursorColumn - slashMatch[0].length;
          const coords = editor.getScrolledVisiblePosition(position);
          const editorDomNode = editor.getDomNode();
          if (!coords || !editorDomNode) {
            return;
          }

          const rect = editorDomNode.getBoundingClientRect();

          openMenu(
            rect.top + coords.top - 20,
            rect.left + coords.left,
            model.getOffsetAt({
              lineNumber: position.lineNumber,
              column: slashStart,
            }),
            model.getOffsetAt(position),
          );
          setFilter(slashMatch[1]);
        } else {
          closeMenu();
        }
      });

      // Add paste handler to ensure paste events trigger updates
      editor.onDidPaste(() => {
        // Use a small timeout to ensure the content is fully pasted
        setTimeout(() => {
          const currentValue = editor.getValue();
          onChange(currentValue);
        }, 10);
      });

      editor.onDidBlurEditorText(() => {
        setTimeout(closeMenu, 150);
      });
    },
    [closeMenu, onEditorReady, openMenu, setFilter],
  );

  return (
    <div className="relative h-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        theme={mounted && resolvedTheme === "light" ? "vs" : "vs-dark"}
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          fontSize: 15,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
          padding: { top: 20, bottom: 20 },
          lineHeight: 1.6,
        }}
      />

      {isOpen && (
        <div
          className="absolute z-50 w-64 rounded-md border border-border bg-popover p-1 shadow-lg"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <div className="max-h-64 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className={`flex cursor-pointer items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent ${
                    index === selectedIndex ? "bg-accent" : ""
                  }`}
                  onClick={() => selectCommand(command)}
                >
                  <div className="flex-1">
                    <div className="font-medium">{command.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {command.description}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No commands found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
