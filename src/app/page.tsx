import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/hero/Hero";
import { Problem } from "@/components/problem/Problem";
import { Features } from "@/components/features/Features";
import { Difference } from "@/components/product/Difference";
import { FoldMoment } from "@/components/fold/FoldMoment";
import { ExplodedSection } from "@/components/exploded/ExplodedSection";
import { Specs } from "@/components/specs/Specs";
import { SocialProof } from "@/components/proof/SocialProof";
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
        <Difference />
        <FoldMoment />
        <ExplodedSection />
        <Specs />
        <SocialProof />
        <BuySection />
        <FounderNote />
      </main>
      <SiteFooter />
    </>
  );
}
