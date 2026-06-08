import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { FAQ } from "@/components/sections/faq";

import { HomeSectionScroller } from "@/components/layout/home-section-scroller";

export default function Home() {
  return (
    <div className="relative overflow-hidden py-4 sm:py-6 lg:py-8">
      <HomeSectionScroller />
      <Hero />
      <Features />
      <FAQ />
    </div>
  );
}
