"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrueRack } from "@/components/brand/Marks";
import { HeroStage } from "@/components/rack/HeroStage";
import { BRAND } from "@/lib/brand";

export function Hero() {
  return (
    <section id="home" className="relative isolate">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_42%,rgba(243,238,228,0.07),transparent_58%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="mx-auto flex h-[100svh] max-w-site flex-col px-5 pb-4 pt-[4.75rem] md:h-auto md:min-h-[100svh] md:px-8 md:pb-8 md:pt-24">
        <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-8">
          <div className="relative z-10 min-w-0 shrink-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-baseline gap-2"
            >
              <span className="kicker">Introducing</span>
              <TrueRack className="font-display text-[0.95rem] font-semibold tracking-tight" />
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="display mt-3 text-[2.05rem] font-bold leading-[0.92] sm:mt-5 sm:text-6xl lg:text-[4.35rem] xl:text-[4.85rem]"
            >
              <span className="block">THE POOL RACK</span>
              <span className="block text-ember">RE-ENGINEERED</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-3 max-w-sm text-sm leading-relaxed text-paper/80 sm:mt-6 sm:text-lg"
            >
              Precision-engineered for a tight rack. Designed to fold flat
              and go wherever you play.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-4 flex flex-col items-stretch gap-2.5 sm:mt-8 sm:flex-row sm:items-center sm:gap-4"
            >
              <Link href="/#shop" className="ember-btn">
                Get the Rack — {BRAND.priceLabel}
              </Link>

            </motion.div>
          </div>

          <div className="relative mt-2 min-h-0 w-full flex-1 touch-none md:mx-0 md:mt-0 md:h-[68vh] md:max-h-[640px] md:min-h-[380px] md:flex-none">
            <div className="absolute inset-0 md:relative md:inset-auto md:h-full">
              <HeroStage />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <p className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-paper-mute sm:text-[0.68rem]">
            Folds flat · locks at 60°
          </p>
          <p className="font-display text-[0.62rem] uppercase tracking-[0.22em] text-paper-mute sm:text-[0.68rem]">
            Drag to spin.
          </p>
        </div>
      </div>
    </section>
  );
}
