"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroStage } from "@/components/rack/HeroStage";
import { BRAND } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative isolate overflow-x-clip grain">
      <div className="pointer-events-none absolute inset-x-[8%] top-[12%] h-[52%] rounded-full bg-paper/[0.07] blur-[110px]" />
      <div className="pointer-events-none absolute right-[4%] top-[22%] h-[48%] w-[46%] rounded-full bg-chalk/[0.08] blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent" />

      <div className="mx-auto flex max-w-site flex-col gap-8 px-5 pb-14 pt-24 md:grid md:min-h-[100svh] md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-8 md:px-8 md:pb-16 md:pt-24">
        <div className="relative z-10 min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="kicker"
          >
            One product. One job.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="display mt-4 text-[12.5vw] leading-[0.88] sm:mt-5 sm:text-7xl md:text-8xl lg:text-[7.4rem]"
          >
            IT FINALLY
            <br />
            <span className="text-ember">RACKS TIGHT.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-md text-base leading-relaxed text-paper-mute sm:mt-7 sm:text-lg"
          >
            Cheap racks flex. Wood racks warp. This one is two printed
            rails and a pin. It locks open against the table cushion, then
            folds flat when you&apos;re done. The pack holds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-7 flex flex-col items-stretch gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Link href="#buy" className="ember-btn">
              Get the Rack — {BRAND.priceLabel}
            </Link>
            <Link href="#fold" className="ghost-btn">
              See it fold
            </Link>
          </motion.div>
          <p className="mt-6 font-display text-[0.68rem] uppercase tracking-[0.2em] text-paper-mute sm:mt-8 sm:text-[0.7rem]">
            PAL · folds flat · locks at 60°
          </p>
        </div>

        <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px] touch-none md:mx-0 md:aspect-auto md:h-[74vh] md:max-h-[700px] md:min-h-[380px] md:max-w-none">
          <HeroStage />
          <p className="pointer-events-none absolute bottom-2 right-2 font-display text-[0.58rem] uppercase tracking-[0.2em] text-paper-mute/70 sm:text-[0.62rem]">
            Drag to spin.
          </p>
        </div>
      </div>
    </section>
  );
}
