"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AppContainer } from "@/components/layout/app-container";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Github,
  Instagram,
  Mail,
  Twitter,
  type LucideIcon,
} from "lucide-react";

type FooterLink = {
  label: string;
  href: string;
  sectionId?: "features" | "faq";
};

type SocialLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const productLinks: FooterLink[] = [
  { label: "Editor", href: "/editor" },
  { label: "Blogs", href: "/blogs" },
  { label: "Features", href: "/", sectionId: "features" },
  { label: "FAQs", href: "/", sectionId: "faq" },
];

const resourceLinks: FooterLink[] = [
  { label: "GitHub", href: "https://github.com/kartikey2004-git" },
  { label: "Support", href: "mailto:hello@markstack.app" },
  { label: "Instagram", href: "https://www.instagram.com/_k4rtik.exe/" },
  { label: "Twitter", href: "https://x.com/kartikeybuilds" },
];

const socialLinks: SocialLink[] = [
  {
    href: "https://github.com/kartikey2004-git",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "mailto:hello@markstack.app",
    label: "Support Us",
    icon: Mail,
  },
  {
    href: "https://www.instagram.com/_k4rtik.exe/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://x.com/kartikeybuilds",
    label: "Twitter",
    icon: Twitter,
  },
];

function FooterNavLink({ label, href, sectionId }: FooterLink) {
  const pathname = usePathname();
  const router = useRouter();
  const isExternal = href.startsWith("http");
  const isMailTo = href.startsWith("mailto:");

  const handleSectionNavigation = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const scrollToSection = () => {
      const target = document.getElementById(sectionId!);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (pathname === "/") {
      scrollToSection();
      return;
    }

    window.sessionStorage.setItem("home-scroll-target", sectionId!);
    router.push("/");
  };

  if (sectionId) {
    return (
      <button
        type="button"
        onClick={handleSectionNavigation}
        className="block text-left transition-colors hover:text-foreground"
      >
        {label}
      </button>
    );
  }

  if (isExternal || isMailTo) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="block transition-colors hover:text-foreground"
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className="block transition-colors hover:text-foreground">
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30 backdrop-blur">
      <AppContainer className="px-6 py-8 sm:py-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:items-start">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">About App</h4>
            <p className="text-sm leading-6 text-muted-foreground">
              MarkStack helps you write and publish markdown content with a
              clean editor, live preview, and simple workflows.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Products</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((link) => (
                <FooterNavLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  sectionId={link.sectionId}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Resources</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <FooterNavLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  sectionId={link.sectionId}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3 md:justify-self-end">
            <h4 className="text-sm font-medium text-foreground">Connect</h4>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                const isExternal = social.href.startsWith("http");

                return (
                  <Tooltip key={social.label}>
                    <TooltipTrigger asChild>
                      <a
                        href={social.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noreferrer" : undefined}
                        aria-label={social.label}
                        className="size-8 flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Icon className="size-4" />
                        <span className="sr-only">{social.label}</span>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="top">{social.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 MarkStack. All rights reserved.</p>
          <a
            href="https://kartikcodes.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Built by Kartikey
          </a>
        </div>
      </AppContainer>
    </footer>
  );
}
