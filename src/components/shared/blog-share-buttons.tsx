"use client";

import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

interface BlogShareButtonsProps {
  title: string;
  description?: string | null;
}

function buildShareText(title: string, description?: string | null) {
  const trimmedDescription = description?.trim();

  if (!trimmedDescription) {
    return title;
  }

  return `${title} - ${trimmedDescription}`;
}

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=640,height=720");
}

export function BlogShareButtons({
  title,
  description,
}: BlogShareButtonsProps) {
  const handleTwitterShare = () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(buildShareText(title, description));

    openShareWindow(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${pageUrl}`,
    );
  };

  const handleLinkedInShare = () => {
    const pageUrl = encodeURIComponent(window.location.href);

    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`,
    );
  };

  const handleInstagramShare = async () => {
    const pageUrl = window.location.href;
    const shareText = buildShareText(title, description);

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text: shareText,
          url: pageUrl,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(pageUrl);
        openShareWindow("https://www.instagram.com/");
        toast.success("Post link copied. Paste it into Instagram to share.");
        return;
      }

      openShareWindow("https://www.instagram.com/");
      toast.info("Open Instagram and paste this post link to share it.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      toast.error("Unable to start Instagram sharing right now.");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleTwitterShare}
      >
        <Twitter className="size-4" />
        Twitter
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleInstagramShare}
      >
        <Instagram className="size-4" />
        Instagram
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleLinkedInShare}
      >
        <Linkedin className="size-4" />
        LinkedIn
      </Button>
    </div>
  );
}
