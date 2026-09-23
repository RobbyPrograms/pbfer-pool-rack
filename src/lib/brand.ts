export const BRAND = {
  name: "PBFER",
  product: "The Rack",
  tagline: "It finally racks tight.",
  priceCents: 18900,
  priceLabel: "$189",
  waitlistCap: 100,
  accent: "#FF5A1F",
  ink: "#0A0A0B",
  inkRaised: "#111113",
  paper: "#F3EEE4",
  paperMute: "#A39C90",
  felt: "#1F4A3A",
  material: "Glass-filled nylon",
  materialShort: "PA12-GF",
} as const;

export const SPECS = [
  { label: "Frame", value: "SLS-printed glass-filled nylon (PA12-GF)" },
  { label: "Finish", value: "As-printed, matte charcoal" },
  { label: "Hinges", value: "Locking corner hinges, three of them" },
  { label: "Folded", value: "Flat — 280 × 28 × 14 mm sleeve" },
  { label: "Open lock", value: "Positive detent at 60° per corner" },
  { label: "Weight", value: "168 g" },
  { label: "Outer edge (open)", value: "280 mm" },
  { label: "Ball size", value: "2¼″ regulation" },
  { label: "Rail seat", value: "15° printed chamfer" },
  { label: "Compatibility", value: "7–9 ft tables, 15-ball rack" },
  { label: "Warranty", value: "Replace it if a hinge lets go" },
] as const;

export const STATS = [
  { num: "PA12", unit: "", label: "Glass-filled nylon. Printed as one family of parts, not a cheap injection lump." },
  { num: "3", unit: "", label: "Corner hinges. Pinch the latch, it goes flat. Snap it open, it locks." },
  { num: "168", unit: "g", label: "Light enough for a drawer. Stiff enough that the pack doesn't yawn." },
  { num: "15", unit: "°", label: "Printed seat. Balls drop in. They don't climb the wall." },
] as const;
