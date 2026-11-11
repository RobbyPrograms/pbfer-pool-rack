import { Faq } from "./Faq";

export function SupportSection() {
  return (
    <section id="support" className="scroll-mt-24 border-t border-ink-line">
      <div className="mx-auto max-w-site px-5 py-20 md:px-8">
        <p className="kicker">Support</p>
        <h2 className="display mt-4 text-4xl sm:text-5xl">
          Questions, answered.
        </h2>
        <div className="mt-8">
          <Faq />
        </div>
      </div>
    </section>
  );
}
