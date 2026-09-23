import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const STATS: Record<string, { num: string; label: string }> = {
  tolerance: { num: "0.2 mm", label: "Corner tolerance" },
  alloy: { num: "6061-T6", label: "Aircraft aluminum" },
  weight: { num: "312 g", label: "Ready weight" },
  bevel: { num: "15°", label: "Seating chamfer" },
};

export async function GET(request: NextRequest) {
  const stat = request.nextUrl.searchParams.get("stat") || "tolerance";
  const picked = STATS[stat] ?? STATS.tolerance;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0B",
          color: "#F3EEE4",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              letterSpacing: "0.22em",
              fontSize: 22,
            }}
          >
            PBFER
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              border: "2px solid #FF5A1F",
              transform: "rotate(0deg)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#A39C90",
            }}
          >
            {picked.label}
          </div>
          <div
            style={{
              fontSize: 128,
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              color: "#FF5A1F",
              marginTop: 12,
            }}
          >
            {picked.num}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#A39C90",
          }}
        >
          <span>THE RACK</span>
          <span>IT FINALLY RACKS TIGHT.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
