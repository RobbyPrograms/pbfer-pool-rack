type RackSvgProps = {
  className?: string;
  glow?: boolean;
  explode?: number;
};

const APEX = { x: 50, y: 20 };
const LEFT = { x: 18, y: 78 };
const RIGHT = { x: 82, y: 78 };

const RAILS = [
  { a: APEX, b: LEFT },
  { a: APEX, b: RIGHT },
] as const;

export function RackSvg({
  className = "",
  glow = true,
  explode = 0,
}: RackSvgProps) {
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
              floodColor="#AD3211"
              floodOpacity="0.55"
            />
          </filter>
        ) : null}
      </defs>
      <g filter={glow ? "url(#ember-glow)" : undefined}>
        {RAILS.map((side, i) => {
          const dx = side.b.x - side.a.x;
          const dy = side.b.y - side.a.y;
          const len = Math.hypot(dx, dy) || 1;
          const seat = 3.2;
          const mx = side.a.x + (dx / len) * (seat + (len - seat) / 2);
          const my = side.a.y + (dy / len) * (seat + (len - seat) / 2);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const span = len - seat - 1;
          return (
            <g
              key={i}
              style={{
                transform: `translate(${(dx / len) * explode * 5}px, ${(dy / len) * explode * 5}px)`,
                transition: "transform 420ms cubic-bezier(.15,.9,.2,1)",
              }}
            >
              <rect
                x={mx - span / 2}
                y={my - 3.1}
                width={span}
                height="6.2"
                rx="1.1"
                transform={`rotate(${angle} ${mx} ${my})`}
                fill="url(#rail)"
                stroke="#AD3211"
                strokeOpacity="0.55"
                strokeWidth="0.45"
              />
            </g>
          );
        })}
        <circle
          cx={APEX.x}
          cy={APEX.y}
          r="2.4"
          fill="#1a1a1d"
          stroke="#AD3211"
          strokeWidth="0.45"
        />
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
              transform: "perspective(900px) rotateX(14deg) rotateZ(-6deg)",
            }
          : undefined
      }
    >
      <div className="absolute inset-[-18%] rounded-full bg-ember/10 blur-3xl" />
      <RackSvg className="relative h-full w-full" explode={explode} />
    </div>
  );
}
