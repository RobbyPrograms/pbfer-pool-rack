"use client";

import { motion } from "framer-motion";

const LINES = [
  {
    n: "01",
    title: "Plastic flexes the second you lean on the 1-ball.",
    copy: "You feel it. The rails bow. The pack looks fine from three feet away and is a mess at the contact points.",
  },
  {
    n: "02",
    title: "Wood warps. Then everyone pretends it didn't.",
    copy: "Leave a wooden rack in a garage for a summer. Bring it back. Tell me that's still a triangle.",
  },
  {
    n: "03",
    title: "The 'pro' ones still don't rack tight.",
    copy: "Thick walls, sloppy corners, balls that sit on the rail instead of seating into it. Looks serious. Packs like a suggestion.",
  },
];

export function Problem() {
  return (
    <section
      id="problem"
      className="relative border-t border-ink-line bg-ink-raised"
    >
      <div className="absolute left-0 top-0 h-full w-[3px] bg-felt" aria-hidden />
      <div className="mx-auto max-w-site px-5 py-24 md:px-8 lg:py-32">
        <p className="kicker">The problem</p>
        <h2 className="display mt-5 max-w-4xl text-4xl sm:text-6xl md:text-7xl">
          Every rack you&apos;ve used
          <br />
          is a little bit crooked.
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper-mute">
          You stopped noticing. The break got sloppy and we all blamed the
          shooter. It was the fixture.
        </p>

        <ol className="mt-16 divide-y divide-ink-line border-y border-ink-line">
          {LINES.map((item, i) => (
            <motion.li
              key={item.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="grid gap-4 py-10 md:grid-cols-[5rem_1fr_1fr] md:gap-10"
            >
              <span className="font-display text-ember">{item.n}</span>
              <h3 className="font-display text-2xl leading-tight md:text-3xl">
                {item.title}
              </h3>
              <p className="text-paper-mute md:pt-1">{item.copy}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
