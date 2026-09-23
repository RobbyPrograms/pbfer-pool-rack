"use client";

import Link from "next/link";
import { useEasterEgg } from "@/components/easter-egg/ShopTalk";

export function SiteHeader() {
  const { bumpLogo } = useEasterEgg();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-line/80 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          onClick={bumpLogo}
          className="flex items-center gap-3"
          aria-label="PBFER home"
        >
          <span className="relative block h-6 w-6">
            <span className="absolute inset-0 rotate-0 border border-ember" />
            <span className="absolute inset-[5px] rotate-45 border border-paper/70" />
          </span>
          <span className="font-display text-sm tracking-brand text-paper">
            PBFER
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute md:flex">
          <Link href="#problem" className="hover:text-paper">
            Problem
          </Link>
          <Link href="#anatomy" className="hover:text-paper">
            Anatomy
          </Link>
          <Link href="#toy" className="hover:text-paper">
            Tightness
          </Link>
          <Link href="#buy" className="hover:text-paper">
            Buy
          </Link>
        </nav>
        <Link href="#buy" className="ember-btn !px-4 !py-2.5">
          Get the Rack
        </Link>
      </div>
    </header>
  );
}
