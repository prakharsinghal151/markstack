"use client";

import { useEffect } from "react";

const HOME_SCROLL_KEY = "home-scroll-target";

export function HomeSectionScroller() {
  useEffect(() => {
    const targetId = window.sessionStorage.getItem(HOME_SCROLL_KEY);

    if (!targetId) {
      return;
    }

    window.sessionStorage.removeItem(HOME_SCROLL_KEY);

    window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return null;
}
