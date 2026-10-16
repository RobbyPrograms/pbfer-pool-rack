const COLS = ["House triangle", "Other folders", "The Rack"] as const;
const COLS_SHORT = ["House", "Others", "The Rack"] as const;

type Mark = "full" | "half" | "none";

const ROWS: {
  label: string;
  hint: string;
  icon: "apex" | "angle" | "fold" | "lift";
  marks: [Mark, Mark, Mark];
}[] = [
  {
    label: "The 1-ball stays put",
    hint: "Apex actually captures it",
    icon: "apex",
    marks: ["half", "none", "full"],
  },
  {
    label: "Opens to 60° and stays there",
    hint: "Not a suggestion. A detent.",
    icon: "angle",
    marks: ["half", "none", "full"],
  },
  {
    label: "Folds flat",
    hint: "Sleeve, drawer, bag pocket",
    icon: "fold",
    marks: ["none", "full", "full"],
  },
  {
    label: "Comes off without lifting the pack",
    hint: "No third rail to drag the balls",
    icon: "lift",
    marks: ["none", "half", "full"],
  },
];

const KINDS = ["triangle", "loose", "caret"] as const;

export function Problem() {
  return (
    <section id="problem" className="relative border-t border-ink-line bg-ink">
      <div className="mx-auto max-w-site px-5 py-20 md:px-8 md:py-24 lg:py-28">
        <p className="kicker">Versus</p>
        <h2 className="display mt-4 max-w-3xl text-4xl sm:text-6xl">
          Same job.
          <br />
          Fewer excuses.
        </h2>
        <p className="mt-5 max-w-md text-paper-mute">
          A house triangle, a folding rack from Amazon, and this.
          Four things that actually change the pack.
        </p>

        <div className="mt-12 md:hidden">
          <MobileCompare />
        </div>
        <div className="mt-14 hidden md:block">
          <DesktopCompare />
        </div>
      </div>
    </section>
  );
}

function MobileCompare() {
  return (
    <div className="border-t border-ink-line">
      <div className="grid grid-cols-3">
        {COLS_SHORT.map((col, i) => (
          <div
            key={col}
            className={`border-b border-ink-line px-1.5 py-4 text-center ${
              i === 2 ? "bg-ink-raised" : ""
            }`}
          >
            <p
              className={`font-display text-[0.58rem] uppercase tracking-[0.12em] ${
                i === 2 ? "text-ember" : "text-paper-mute"
              }`}
            >
              {col}
            </p>
            <div className="mx-auto mt-3 flex h-14 items-center justify-center">
              <RackGlyph kind={KINDS[i]} compact />
            </div>
          </div>
        ))}
      </div>

      {ROWS.map((row) => (
        <div key={row.label} className="border-b border-ink-line py-5">
          <p className="font-display text-[0.95rem] leading-snug">{row.label}</p>
          <p className="mt-1 text-xs text-paper-mute">{row.hint}</p>
          <div className="mt-4 grid grid-cols-3">
            {row.marks.map((mark, i) => (
              <div
                key={`${row.label}-${i}`}
                className={`flex justify-center py-2 ${
                  i === 2 ? "bg-ink-raised" : ""
                }`}
              >
                <Score mark={mark} hot={i === 2 && mark === "full"} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DesktopCompare() {
  return (
    <div className="border-t border-ink-line">
      <div className="grid grid-cols-[minmax(11rem,1.4fr)_repeat(3,minmax(7.5rem,1fr))]">
        <div className="border-b border-ink-line py-5 pr-4" />
        {COLS.map((col, i) => (
          <div
            key={col}
            className={`border-b border-ink-line px-3 py-5 text-center ${
              i === 2 ? "border-l border-ember/50 bg-ink-raised" : ""
            }`}
          >
            <p
              className={`font-display text-[0.7rem] uppercase tracking-[0.16em] ${
                i === 2 ? "text-ember" : "text-paper-mute"
              }`}
            >
              {col}
            </p>
            <div className="mx-auto mt-6 flex h-[88px] items-center justify-center">
              <RackGlyph kind={KINDS[i]} />
            </div>
          </div>
        ))}

        {ROWS.map((row) => (
          <DesktopRow key={row.label} row={row} />
        ))}
      </div>
    </div>
  );
}

function DesktopRow({ row }: { row: (typeof ROWS)[number] }) {
  return (
    <>
      <div className="flex items-center gap-4 border-b border-ink-line py-6 pr-4">
        <FeatureGlyph kind={row.icon} />
        <div>
          <p className="font-display text-[0.95rem] leading-snug text-paper">
            {row.label}
          </p>
          <p className="mt-1 text-xs text-paper-mute">{row.hint}</p>
        </div>
      </div>
      {row.marks.map((mark, i) => (
        <div
          key={`${row.label}-${i}`}
          className={`flex items-center justify-center border-b border-ink-line px-3 py-6 ${
            i === 2 ? "border-l border-ember/50 bg-ink-raised" : ""
          }`}
        >
          <Score mark={mark} hot={i === 2 && mark === "full"} />
        </div>
      ))}
    </>
  );
}

function Score({ mark, hot }: { mark: Mark; hot?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      {mark === "none" ? (
        <circle
          cx="12"
          cy="12"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          className="text-ink-line"
        />
      ) : null}
      {mark === "half" ? (
        <>
          <circle
            cx="12"
            cy="12"
            r="7"
            fill="none"
            stroke="#AD3211"
            strokeWidth="1.25"
            opacity="0.45"
          />
          <path d="M12 5a7 7 0 0 0 0 14Z" fill="#AD3211" />
        </>
      ) : null}
      {mark === "full" ? (
        <circle
          cx="12"
          cy="12"
          r="7"
          fill="#AD3211"
          className={hot ? "drop-shadow-[0_0_10px_rgba(173,50,17,0.45)]" : ""}
        />
      ) : null}
    </svg>
  );
}

const RACK_ART = {
  triangle: { src: "/compare/house-triangle.png", alt: "House triangle" },
  loose: { src: "/compare/other-folders.png", alt: "Other folding racks" },
  caret: { src: "/compare/the-rack.png", alt: "The Rack" },
} as const;

function RackGlyph({
  kind,
  compact = false,
}: {
  kind: "triangle" | "loose" | "caret";
  compact?: boolean;
}) {
  const art = RACK_ART[kind];
  return (
    <img
      src={art.src}
      alt={art.alt}
      className={
        compact
          ? "h-12 w-auto max-w-[72px] object-contain"
          : "h-[76px] w-auto max-w-[110px] object-contain"
      }
    />
  );
}

function FeatureGlyph({ kind }: { kind: "apex" | "angle" | "fold" | "lift" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-10 w-10 shrink-0"
      aria-hidden
      fill="none"
      stroke="#A39C90"
      strokeWidth="1.2"
    >
      {kind === "apex" ? (
        <>
          <path d="M8 32 L20 8 L32 32" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="18" r="3.2" fill="#AD3211" stroke="none" />
        </>
      ) : null}
      {kind === "angle" ? (
        <>
          <path d="M8 30 L20 10 L32 30" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 20 A10 10 0 0 1 26 20" />
        </>
      ) : null}
      {kind === "fold" ? (
        <>
          <rect x="10" y="17" width="20" height="4.5" rx="1" />
          <circle cx="10" cy="19.2" r="1.8" />
        </>
      ) : null}
      {kind === "lift" ? (
        <>
          <path d="M8 28 L20 10 L32 28" strokeLinecap="round" />
          <path d="M12 32 H28" />
          <path d="M14 8 V3 M26 8 V3" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}
