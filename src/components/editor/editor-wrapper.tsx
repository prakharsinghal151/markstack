"use client";

import { useRef, useCallback, useEffect } from "react";
import { useMarkdown } from "@/hooks/use-markdown";
import { useBlogSave } from "@/hooks/use-blog-save";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toolbar } from "@/components/editor/editor-toolbar";
import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { ImageDropzone } from "@/components/editor/image-dropzone";
import { MarkdownDropzone } from "@/components/editor/markdown-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Save } from "lucide-react";
import type { Blog } from "@/types/blog";
import type { EditorInstance } from "@/types/editor";
import { MarkdownPreview } from "./preview-pane";

interface EditorWrapperProps {
  blog?: Blog;
}

export function EditorWrapper({ blog }: EditorWrapperProps) {
  const editorRef = useRef<EditorInstance | null>(null);
  const isMobile = useIsMobile();

  const {
    content,
    setContent,
    serializedContent,
    isLoading,
    insertSyntax,
    handleImageUpload,
    handleStructureMarkdown,
    setEditorRef,
  } = useMarkdown("");

  const {
    title,
    setTitle,
    description,
    setDescription,
    isSaving,
    saveBlog,
    saveDraft,
    loadDraft,
  } = useBlogSave();

  // Load existing blog data or draft on mount
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description ?? "");
      setContent(blog.content ?? "");
    } else {
      const draftContent = loadDraft();
      if (draftContent) setContent(draftContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft when content changes
  useEffect(() => {
    if (!content) return;
    const timer = setTimeout(() => saveDraft(content), 1000);
    return () => clearTimeout(timer);
  }, [content, saveDraft]);

  const handleEditorReady = useCallback(
    (editor: EditorInstance) => {
      editorRef.current = editor;
      setEditorRef(editor);
    },
    [setEditorRef],
  );

  const handleSaveBlog = useCallback(async () => {
    const slug = await saveBlog(content, blog?.id);
    if (slug) {
      window.location.href = `/blogs/${slug}`;
    }
  }, [content, saveBlog, blog]);

  return (
    <div className="space-y-4">
      <Card className="border-border/80 bg-card/70 shadow-sm">
        <CardContent className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.8fr_2fr_auto] sm:grid-cols-1 auto-cols-fr">
            <Input
              placeholder="Blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10"
            />
            <Textarea
              placeholder="Brief description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-10 resize-none"
              rows={1}
            />
            <Button
              onClick={handleSaveBlog}
              disabled={isSaving || !title.trim() || !content.trim()}
              className="h-10 whitespace-nowrap"
            >
              <Save className="mr-2 size-4" />
              {isSaving ? "Saving..." : "Save Blog"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/80 bg-card/70 shadow-sm">
        <Toolbar
          onInsert={insertSyntax}
          onStructureMarkdown={handleStructureMarkdown}
          onFileUpload={setContent}
        />

        <div className="h-[70vh] min-h-[130px]">
          <ResizablePanelGroup
            orientation={isMobile ? "vertical" : "horizontal"}
            className="h-full"
          >
            <ResizablePanel defaultSize={50} minSize={30}>
              <div
                className={`relative h-full bg-background ${isMobile ? "border-b" : "border-r"}`}
              >
                <ImageDropzone onImageUpload={handleImageUpload} />
                <MarkdownDropzone onMarkdownUpload={setContent} />
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  onEditorReady={handleEditorReady}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/70" />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full bg-background font-sans overflow-auto">
                <MarkdownPreview
                  content={serializedContent}
                  isLoading={isLoading}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Card>
    </div>
  );
}
