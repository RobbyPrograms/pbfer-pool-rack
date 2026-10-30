import { TrueRack } from "@/components/brand/Marks";

type Mark = "full" | "half" | "none";

const COLS = [
  {
    label: "Traditional triangles",
    src: "/why/traditional-triangle.svg",
    alt: "Traditional triangle",
  },
  {
    label: "Competing folding racks",
    src: "/why/competing-racks.svg",
    alt: "Competing folding rack",
  },
] as const;

const ROWS: {
  label: string;
  src: string;
  wide?: boolean;
  marks: [Mark, Mark, Mark];
}[] = [
  {
    label: "Apex ball capture",
    src: "/why/apex-ball-capture.svg",
    marks: ["half", "none", "full"],
  },
  {
    label: "Precise 60° opening",
    src: "/why/precise-60.svg",
    marks: ["half", "none", "full"],
  },
  {
    label: "Collapsible design",
    src: "/why/collapsible.svg",
    wide: true,
    marks: ["none", "full", "full"],
  },
  {
    label: "Lift-free removal",
    src: "/why/lift-free.svg",
    marks: ["none", "half", "full"],
  },
];

const SCORE_LABEL: Record<Mark, string> = {
  full: "Yes",
  half: "Partial",
  none: "No",
};

export function Problem() {
  return (
    <section id="why" className="relative border-t border-ink-line bg-ink">
      <div className="mx-auto max-w-site px-4 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="grid grid-cols-[minmax(0,1.05fr)_repeat(3,minmax(0,0.9fr))]">
            <div className="flex items-start border-b border-white/10 px-1 py-3 md:px-6 md:py-8">
              <div className="min-w-0">
                <h2 className="font-display text-[1.15rem] font-black leading-none tracking-tight text-paper sm:text-4xl md:text-5xl">
                  Features
                </h2>
                <span className="mt-1.5 block h-[3px] w-8 bg-ember sm:mt-3 sm:h-1 sm:w-14" />
              </div>
            </div>

            {COLS.map((col) => (
              <div
                key={col.src}
                className="flex flex-col items-center border-b border-l border-white/10 px-0.5 py-3 text-center md:px-4 md:py-8"
              >
                <p className="font-display text-[0.5rem] uppercase leading-tight tracking-[0.04em] text-paper sm:text-[0.68rem] sm:tracking-[0.14em] md:text-xs">
                  {col.label}
                </p>
                <img
                  src={col.src}
                  alt={col.alt}
                  className="mt-2 h-10 w-full object-contain sm:h-16 md:mt-6 md:h-28"
                />
              </div>
            ))}

            <div className="rounded-t-xl border border-b-0 border-ember px-0.5 pt-1 md:rounded-t-[1.35rem] md:border-2 md:px-3 md:pt-2">
              <div className="flex h-full flex-col items-center border-b border-white/10 px-0.5 py-3 text-center md:px-2 md:py-6">
                <TrueRack className="font-display text-[0.68rem] font-bold leading-none sm:text-xl md:text-2xl" />
                <img
                  src="/why/true-rack.svg"
                  alt="TrueRack"
                  className="mt-2 h-10 w-full object-contain sm:h-16 md:mt-6 md:h-28"
                />
              </div>
            </div>

            {ROWS.map((row, index) => (
              <FeatureRow key={row.label} row={row} last={index === ROWS.length - 1} />
            ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  row,
  last,
}: {
  row: (typeof ROWS)[number];
  last: boolean;
}) {
  return (
    <>
      <div className="flex min-w-0 flex-col items-start justify-center gap-1.5 border-b border-white/10 px-1 py-3 md:gap-5 md:px-6 md:py-9">
        <p className="font-display text-[0.5rem] uppercase leading-tight tracking-[0.04em] text-paper sm:text-xs sm:tracking-[0.12em] md:text-sm">
          {row.label}
        </p>
        <img
          src={row.src}
          alt=""
          className={
            row.wide
              ? "h-6 w-full max-w-[4.5rem] object-contain object-left sm:h-8 sm:max-w-[7rem] md:h-12 md:max-w-none md:w-48"
              : "h-10 w-10 object-contain object-left sm:h-16 sm:w-16 md:h-32 md:w-32"
          }
        />
      </div>
      {row.marks.map((mark, i) =>
        i === 2 ? (
          <div
            key={`${row.label}-${i}`}
            className={`border-x border-ember px-0.5 md:border-x-2 md:px-3 ${
              last ? "rounded-b-xl border-b pb-1 md:rounded-b-[1.35rem] md:border-b-2 md:pb-2" : ""
            }`}
          >
            <div
              className={`flex h-full items-center justify-center py-3 md:py-7 ${
                last ? "" : "border-b border-white/10"
              }`}
            >
              <Score mark={mark} />
            </div>
          </div>
        ) : (
          <div
            key={`${row.label}-${i}`}
            className="flex items-center justify-center border-b border-l border-white/10 px-0.5 py-3 md:px-3 md:py-7"
          >
            <Score mark={mark} />
          </div>
        ),
      )}
    </>
  );
}

function Score({ mark }: { mark: Mark }) {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center sm:h-14 sm:w-14 md:h-20 md:w-20">
      <span className="sr-only">{SCORE_LABEL[mark]}</span>
      {mark !== "none" ? (
        <span className="absolute bottom-0 h-1.5 w-5 rounded-full bg-[#AD3211]/75 blur-sm sm:h-2.5 sm:w-10 sm:blur-md md:bottom-1 md:h-3.5 md:w-14" />
      ) : null}
      <svg viewBox="0 0 64 64" className="relative h-6 w-6 sm:h-12 sm:w-12 md:h-16 md:w-16" aria-hidden>
        {mark === "none" ? (
          <circle cx="32" cy="28" r="15" fill="none" stroke="#AD3211" strokeWidth="2.25" />
        ) : null}
        {mark === "half" ? (
          <>
            <circle cx="32" cy="28" r="15" fill="none" stroke="#AD3211" strokeWidth="2.25" />
            <path d="M32 13 A15 15 0 0 0 32 43 Z" fill="#AD3211" />
          </>
        ) : null}
        {mark === "full" ? <circle cx="32" cy="28" r="15" fill="#AD3211" /> : null}
      </svg>
    </div>
  );
}
