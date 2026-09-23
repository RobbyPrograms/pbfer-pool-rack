import { SPECS } from "@/lib/brand";

export function Specs() {
  return (
    <section id="specs" className="border-t border-ink-line">
      <div className="mx-auto max-w-site px-5 py-24 md:px-8 lg:py-28">
        <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="kicker">Spec sheet</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl">
              The boring
              <br />
              part that
              <br />
              isn&apos;t.
            </h2>
          </div>
          <dl className="divide-y divide-ink-line border-y border-ink-line">
            {SPECS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-4 text-sm sm:text-base"
              >
                <dt className="text-paper-mute">{row.label}</dt>
                <dd className="font-display text-paper">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
