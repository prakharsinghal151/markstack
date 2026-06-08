import { requireAuth } from "@/lib/auth-utils";
import { EditorWrapper } from "@/components/editor/editor-wrapper";
import { ProtectedPageWrapper } from "@/components/layout/protected-page-wrapper";

export default async function EditorPage() {
  await requireAuth("/editor");

  return (
    <ProtectedPageWrapper
      title="Markdown Editor"
      description="Write and preview your markdown content in real-time"
    >
      <EditorWrapper />
    </ProtectedPageWrapper>
  );
}
