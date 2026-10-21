import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const STATS: Record<string, { num: string; label: string }> = {
  fold: { num: "FLAT", label: "Folds at the apex" },
  nylon: { num: "PAL", label: "Glass-filled nylon" },
  weight: { num: "283 g", label: "Ready weight" },
  bevel: { num: "15°", label: "Printed seat" },
};

export async function GET(request: NextRequest) {
  const stat = request.nextUrl.searchParams.get("stat") || "fold";
  const picked = STATS[stat] ?? STATS.fold;
  const industry = await readFile(
    join(process.cwd(), "src/fonts/industry/Industry-Black.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#19191C",
          color: "#F3EEE4",
          padding: "64px 72px",
          fontFamily: "Industry",
        }}
      >
        <div style={{ display: "flex", fontSize: 42, letterSpacing: "-0.03em" }}>
          BuiltTrue
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
              color: "#AD3211",
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
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Industry", data: industry, weight: 900, style: "normal" }],
    },
  );
}
