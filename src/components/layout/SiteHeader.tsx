"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TrueRack } from "@/components/brand/Marks";
import { useEasterEgg } from "@/components/easter-egg/ShopTalk";

const TABS = [
  { href: "/#home", label: "Home" },
  { href: "/#why", label: "Why" },
  { href: "/#features", label: "Features" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#support", label: "Support" },
  { href: "/#shop", label: "Shop" },
] as const;

export function SiteHeader() {
  const { bumpLogo } = useEasterEgg();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink-line/80 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-site items-center gap-4 px-5 py-3 md:px-8">
        <Link
          href="/#home"
          onClick={() => {
            bumpLogo();
            setOpen(false);
          }}
          className="flex shrink-0 items-center"
          aria-label="Built True home"
        >
          <Image
            src="/brand/built-tree.png"
            alt="Built True"
            width={300}
            height={66}
            className="h-5 w-auto max-w-[46vw] sm:h-7 sm:max-w-none"
            priority
          />
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-x-3 text-[0.62rem] uppercase tracking-[0.12em] text-paper-mute lg:flex xl:gap-x-5 xl:text-[0.68rem] xl:tracking-[0.14em]">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="shrink-0 whitespace-nowrap hover:text-paper"
            >
              {tab.href === "/#why" ? (
                <>
                  Why <TrueRack />
                </>
              ) : (
                tab.label
              )}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="font-display text-[0.68rem] uppercase tracking-[0.16em] text-paper-mute hover:text-paper lg:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <Link
            href="/#shop"
            onClick={() => setOpen(false)}
            className="ember-btn shrink-0 whitespace-nowrap !px-3 !py-2 text-[0.65rem] sm:!px-4 sm:!py-2.5 sm:text-[0.78rem]"
          >
            Get the Rack
          </Link>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-ink-line/80 px-5 py-4 lg:hidden">
          <div className="mx-auto flex max-w-site flex-col gap-4 text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="hover:text-paper"
                onClick={() => setOpen(false)}
              >
                {tab.href === "/#why" ? (
                  <>
                    Why <TrueRack />
                  </>
                ) : (
                  tab.label
                )}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
