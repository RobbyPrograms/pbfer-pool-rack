import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/hero/Hero";
import { Problem } from "@/components/problem/Problem";
import { Features } from "@/components/features/Features";
import { ExplodedSection } from "@/components/exploded/ExplodedSection";
import { SocialProof } from "@/components/proof/SocialProof";
import { SupportSection } from "@/components/support/SupportSection";
import { BuySection } from "@/components/buy/BuySection";
import { FounderNote } from "@/components/founder/FounderNote";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Features />
        <ExplodedSection />
        <SocialProof />
        <section
          id="gallery"
          aria-label="Gallery"
          className="min-h-[50vh] scroll-mt-24 border-t border-ink-line"
        />
        <FounderNote />
        <SupportSection />
        <BuySection />
      </main>
      <SiteFooter />
    </>
  );
}
