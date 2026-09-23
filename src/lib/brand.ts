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
} as const;

export const SPECS = [
  { label: "Frame", value: "6061-T6 aluminum" },
  { label: "Finish", value: "Hard-anodized, matte" },
  { label: "Corner tolerance", value: "±0.2 mm" },
  { label: "Weight", value: "312 g" },
  { label: "Outer edge", value: "280 mm" },
  { label: "Ball size", value: "2¼″ regulation" },
  { label: "Rail bevel", value: "15° seating chamfer" },
  { label: "Joints", value: "Pinned, no fasteners" },
  { label: "Compatibility", value: "7–9 ft tables, 15-ball rack" },
  { label: "Warranty", value: "Lifetime against warp" },
] as const;

export const STATS = [
  { num: "0.2", unit: "mm", label: "Corner tolerance. Not a vibe. A number." },
  { num: "6061", unit: "", label: "T6 aluminum. Same alloy as bike frames that don't banana." },
  { num: "312", unit: "g", label: "Light enough to toss. Heavy enough to stay put." },
  { num: "15", unit: "°", label: "Rail bevel that seats balls instead of riding them." },
] as const;
