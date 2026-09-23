"use client";

import { motion } from "framer-motion";
import { STATS } from "@/lib/brand";

export function Difference() {
  return (
    <section id="difference" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rotate-45 border border-ink-line" />
      <div className="mx-auto max-w-site px-5 py-24 md:px-8 lg:py-32">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="kicker">How it&apos;s different</p>
            <h2 className="display mt-4 max-w-3xl text-4xl sm:text-6xl">
              Built like a fixture.
              <br />
              Sold like a rack.
            </h2>
          </div>
          <p className="max-w-sm text-paper-mute">
            Not a feature grid. Four numbers that actually change how the
            pack sits.
          </p>
        </div>

        <div className="mt-16 grid gap-px bg-ink-line md:grid-cols-2">
          {STATS.map((stat, i) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="bg-ink px-6 py-10 md:px-10 md:py-14"
            >
              <p className="display text-[18vw] leading-none text-ember sm:text-8xl md:text-9xl">
                {stat.num}
                <span className="align-top text-3xl text-ember/80 md:text-4xl">
                  {stat.unit}
                </span>
              </p>
              <p className="mt-6 max-w-sm text-lg text-paper">{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
