import { WaitlistForm } from "./WaitlistForm";

export function WaitlistBand() {
  return (
    <section id="waitlist" className="border-t border-ink-line">
      <div className="mx-auto max-w-site px-5 py-20 md:px-8">
        <div className="grid items-end gap-10 border border-ink-line bg-ink-raised p-8 md:grid-cols-[1fr_auto] md:p-12">
          <WaitlistForm />
          <p className="max-w-xs text-sm text-paper-mute md:text-right">
            Tell a friend before 100 fills. The etch is the whole point of
            getting here early.
          </p>
        </div>
      </div>
    </section>
  );
}
