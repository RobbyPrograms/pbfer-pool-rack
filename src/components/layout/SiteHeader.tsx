"use client";

import Image from "next/image";
import Link from "next/link";
import { useEasterEgg } from "@/components/easter-egg/ShopTalk";

export function SiteHeader() {
  const { bumpLogo } = useEasterEgg();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-line/80 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-3 md:px-8">
        <Link
          href="/"
          onClick={bumpLogo}
          className="flex items-center"
          aria-label="Built Tree home"
        >
          <Image
            src="/brand/built-tree.png"
            alt="Built Tree"
            width={300}
            height={66}
            className="h-5 w-auto max-w-[46vw] sm:h-7 sm:max-w-none"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute md:flex">
          <Link href="#problem" className="hover:text-paper">
            Versus
          </Link>
          <Link href="#fold" className="hover:text-paper">
            Fold
          </Link>
          <Link href="#anatomy" className="hover:text-paper">
            Anatomy
          </Link>
          <Link href="#buy" className="hover:text-paper">
            Buy
          </Link>
        </nav>
        <Link href="#buy" className="ember-btn shrink-0 whitespace-nowrap !px-3 !py-2 text-[0.65rem] sm:!px-4 sm:!py-2.5 sm:text-[0.78rem]">
          Get the Rack
        </Link>
      </div>
    </header>
  );
}
