type RackSvgProps = {
  className?: string;
  glow?: boolean;
  explode?: number;
};

const RAILS = [
  { x: 50, y: 22, rot: 0 },
  { x: 24, y: 68, rot: 60 },
  { x: 76, y: 68, rot: -60 },
] as const;

export function RackSvg({
  className = "",
  glow = true,
  explode = 0,
}: RackSvgProps) {
  const offsets = [
    { x: 0, y: -explode * 10 },
    { x: -explode * 10, y: explode * 7 },
    { x: explode * 10, y: explode * 7 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="rail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2a2e" />
          <stop offset="45%" stopColor="#161618" />
          <stop offset="100%" stopColor="#3a3a40" />
        </linearGradient>
        {glow ? (
          <filter id="ember-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="1.4"
              floodColor="#FF5A1F"
              floodOpacity="0.55"
            />
          </filter>
        ) : null}
      </defs>
      <g filter={glow ? "url(#ember-glow)" : undefined}>
        {RAILS.map((rail, i) => (
          <g
            key={i}
            style={{
              transform: `translate(${offsets[i].x}px, ${offsets[i].y}px)`,
              transition: "transform 420ms cubic-bezier(.15,.9,.2,1)",
            }}
          >
            <rect
              x={rail.x - 28}
              y={rail.y - 3.2}
              width="56"
              height="6.4"
              rx="1.2"
              transform={`rotate(${rail.rot} ${rail.x} ${rail.y})`}
              fill="url(#rail)"
              stroke="#FF5A1F"
              strokeOpacity="0.55"
              strokeWidth="0.45"
            />
          </g>
        ))}
        <circle cx="50" cy="22" r="2.1" fill="#1a1a1d" stroke="#FF5A1F" strokeWidth="0.4" />
        <circle cx="24" cy="68" r="2.1" fill="#1a1a1d" stroke="#FF5A1F" strokeWidth="0.4" />
        <circle cx="76" cy="68" r="2.1" fill="#1a1a1d" stroke="#FF5A1F" strokeWidth="0.4" />
      </g>
    </svg>
  );
}

type FallbackStageProps = {
  className?: string;
  explode?: number;
  tilt?: boolean;
};

export function RackFallback({
  className = "",
  explode = 0,
  tilt = true,
}: FallbackStageProps) {
  return (
    <div
      className={`relative ${className}`}
      style={
        tilt
          ? {
              transform:
                "perspective(900px) rotateX(12deg) rotateZ(-8deg)",
            }
          : undefined
      }
    >
      <div className="absolute inset-[-18%] rounded-full bg-ember/10 blur-3xl" />
      <RackSvg className="relative w-full h-full" explode={explode} />
    </div>
  );
}
