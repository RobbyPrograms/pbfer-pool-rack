export function FounderNote() {
  return (
    <section id="founder" className="relative overflow-hidden border-t border-ink-line ripple">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, #1F4A3A 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 py-24 md:px-8 lg:py-28">
        <p className="kicker">A note</p>
        <h2 className="display mt-4 text-4xl sm:text-5xl">Why I made this</h2>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-paper/90">
          <p>
            I built this because I was tired of the same little lie at the
            table. Someone grabs the house rack, mashes fifteen balls into a
            triangle that&apos;s already banana-shaped, and we all act like
            the break was supposed to look like that.
          </p>
          <p>
            I print parts until they stop being a joke. A rack is a fixture.
            Fixtures either lock or they don&apos;t. I don&apos;t know why
            the industry decided &quot;good enough if you squint&quot; was a
            product category, but I&apos;m done buying into it.
          </p>
          <p>
            So I printed one that folds. Two rails, one pin that actually
            detents. The table already had a third side. If it&apos;s on
            your table and the pack is still loose, email me — something
            went wrong, and it&apos;s my problem.
          </p>
        </div>
        <p className="mt-10 font-display text-sm tracking-[0.16em] uppercase text-paper-mute">
          — the person who got tired of it
        </p>
      </div>
    </section>
  );
}
