export const BRAND = {
  name: "Built True",
  product: "The Rack",
  tagline: "It finally racks tight.",
  priceCents: 18900,
  priceLabel: "$59.99",
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
  { label: "Frame", value: "Two rails. The table cushion is the third side." },
  { label: "Material", value: "SLS-printed glass-filled nylon (PAL)" },
  { label: "Finish", value: "As-printed, matte charcoal" },
  { label: "Pin", value: "Single apex hinge, locks open" },
  { label: "Folded", value: "Flat — two rails stacked, 280 × 28 × 14 mm" },
  { label: "Open lock", value: "Positive detent at 60°" },
  { label: "Weight", value: "168 g" },
  { label: "Rail length (open)", value: "280 mm" },
  { label: "Ball size", value: "2¼″ regulation" },
  { label: "Rail seat", value: "15° printed chamfer" },
  { label: "Compatibility", value: "7–9 ft tables, 15-ball rack" },
  { label: "Warranty", value: "Replace it if the pin lets go" },
] as const;

export const STATS = [
  { num: "2", unit: "", label: "Rails. The cushion you already have is the third side. One less part to warp." },
  { num: "1", unit: "", label: "Apex pin. Snap it open, it locks rigid. Fold it, it ships in a sleeve." },
  { num: "283", unit: "g", label: "Light enough for a drawer. Stiff enough that the pack doesn't yawn." },
  { num: "15", unit: "°", label: "Printed seat. Balls drop in. They don't climb the wall." },
] as const;
