"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroStage } from "@/components/rack/HeroStage";
import { BRAND } from "@/lib/brand";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden grain">
      <div className="pointer-events-none absolute inset-x-[12%] top-[18%] h-[42%] rounded-full bg-ember/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent" />

      <div className="mx-auto grid min-h-[100svh] max-w-site items-end gap-8 px-5 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8 md:pt-24">
        <div className="relative z-10">
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
            className="display mt-5 text-[18vw] leading-[0.82] sm:text-7xl md:text-8xl lg:text-[7.4rem]"
          >
            IT FINALLY
            <br />
            <span className="text-ember">RACKS TIGHT.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-7 max-w-md text-lg leading-relaxed text-paper-mute"
          >
            Cheap racks flex. Wood racks warp. This one is machined aluminum
            with a 0.2&nbsp;mm corner. The pack locks. The break actually
            means something.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link href="#buy" className="ember-btn">
              Get the Rack — {BRAND.priceLabel}
            </Link>
            <Link href="#toy" className="ghost-btn">
              See tightness
            </Link>
          </motion.div>
          <p className="mt-8 font-display text-[0.7rem] uppercase tracking-[0.2em] text-paper-mute">
            6061-T6 · ±0.2 mm · lifetime against warp
          </p>
        </div>

        <div className="relative h-[58vw] min-h-[320px] max-h-[620px] md:h-[70vh]">
          <HeroStage />
          <p className="pointer-events-none absolute bottom-2 right-2 hidden font-display text-[0.62rem] uppercase tracking-[0.2em] text-paper-mute/70 md:block">
            Render, not a photo. Drag it.
          </p>
        </div>
      </div>
    </section>
  );
}
