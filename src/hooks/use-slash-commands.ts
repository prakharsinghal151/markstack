"use client";

import { useState, useEffect, useCallback } from "react";
import { slashCommandDefinitions } from "@/lib/markdown/command-catalog";
import type { EditorInstance } from "@/types/editor";

export interface SlashCommand {
  id: string;
  label: string;
  description: string;
  syntax: string;
  icon?: string;
}

export const slashCommands: SlashCommand[] = slashCommandDefinitions;

export function useSlashCommands(
  editorRef: React.RefObject<EditorInstance | null>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const filteredCommands = slashCommands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(filter.toLowerCase()) ||
      cmd.description.toLowerCase().includes(filter.toLowerCase()),
  );

  const openMenu = useCallback(
    (top: number, left: number, startPos: number, endPos: number) => {
      setIsOpen(true);
      setPosition({ top, left });
      setSelectedIndex(0);
      setFilter("");
      setCursorPosition({ start: startPos, end: endPos });
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFilter("");
    setCursorPosition(null);
  }, []);

  const selectCommand = useCallback(
    (command: SlashCommand) => {
      if (!editorRef.current || !cursorPosition) return;

      const editor = editorRef.current;
      const model = editor.getModel();
      if (!model) {
        return;
      }

      // Find the start of the slash command
      let slashStart = cursorPosition.start;
      while (
        slashStart > 0 &&
        model.getValue().charAt(slashStart - 1) !== "\n"
      ) {
        slashStart--;
      }

      // Remove the slash command and insert the new syntax
      const beforeSlash = model.getValue().slice(0, slashStart);
      const afterCursor = model.getValue().slice(cursorPosition.end);
      const newContent = beforeSlash + command.syntax + "\n" + afterCursor;

      editor.setValue(newContent);

      // Position cursor appropriately
      const newCursorPos = slashStart + command.syntax.length;
      const newPos = model.getPositionAt(newCursorPos);
      editor.setPosition(newPos);
      editor.focus();

      closeMenu();
    },
    [editorRef, cursorPosition, closeMenu],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            (prev) =>
              (prev - 1 + filteredCommands.length) % filteredCommands.length,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            selectCommand(filteredCommands[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeMenu();
          break;
      }
    },
    [isOpen, selectedIndex, filteredCommands, selectCommand, closeMenu],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return {
    isOpen,
    position,
    selectedIndex,
    filteredCommands,
    filter,
    setFilter,
    openMenu,
    closeMenu,
    selectCommand,
  };
}
