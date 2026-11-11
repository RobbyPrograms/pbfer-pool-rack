export const BRAND = {
  name: "BuiltTrue",
  product: "The Rack",
  tagline: "Re-Engineered",
  priceCents: 4999,
  priceLabel: "$49.99",
  waitlistCap: 100,
  accent: "#AD3211",
  ink: "#19191C",
  inkRaised: "#222226",
  paper: "#F3EEE4",
  paperMute: "#A39C90",
  felt: "#1F4A3A",
  material: "Glass-filled nylon",
  materialShort: "PAL",
} as const;

export const SPECS = [
  { label: "Frame", value: "Two folding arms with an integrated front-ball cradle" },
  { label: "Material", value: "Carbon-fiber-reinforced plastic" },
  { label: "Finish", value: "Matte" },
  { label: "Pivot", value: "Stainless steel shoulder screw with brass heat-set insert" },
  { label: "Opening stop", value: "Integrated stop slot controls the opening angle" },
  { label: "Folded dimensions", value: "12.5 × 1.125 × 1.5 in (L × W × H)" },
  { label: "Weight", value: "0.625 lbs" },
  { label: "Ball size", value: "Standard 2¼-inch billiard balls" },
  { label: "Compatibility", value: "8-ball, 9-ball, and 10-ball" },
] as const;

export const STATS = [
  { num: "2", unit: "", label: "Rails. The cushion you already have is the third side. One less part to warp." },
  { num: "1", unit: "", label: "Apex pin. Snap it open, it locks rigid. Fold it, it ships in a sleeve." },
  { num: "283", unit: "g", label: "Light enough for a drawer. Stiff enough that the pack doesn't yawn." },
  { num: "15", unit: "°", label: "Printed seat. Balls drop in. They don't climb the wall." },
] as const;
