const SLOTS = [
  { kind: "Press", line: "Logo slot — drop a masthead here when they write it up." },
  { kind: "Early tester", line: "Feedback coming soon. We are not inventing quotes." },
  { kind: "League night", line: "A place for a real table photo. Later." },
];

export function SocialProof() {
  return (
    <section id="reviews" className="border-t border-ink-line bg-ink-raised">
      <div className="mx-auto max-w-site px-5 py-20 md:px-8">
        <p className="kicker">Social proof</p>
        <h2 className="display mt-4 text-3xl sm:text-5xl">
          Empty on purpose.
        </h2>
        <p className="mt-4 max-w-lg text-paper-mute">
          Fake testimonials are worse than none. These are reserved seats.
        </p>
        <div className="mt-12 grid gap-px bg-ink-line md:grid-cols-3">
          {SLOTS.map((slot) => (
            <article
              key={slot.kind}
              className="min-h-[180px] bg-ink-raised p-6"
            >
              <p className="font-display text-[0.68rem] uppercase tracking-[0.2em] text-ember">
                {slot.kind}
              </p>
              <p className="mt-6 text-lg leading-snug text-paper-mute">
                {slot.line}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
