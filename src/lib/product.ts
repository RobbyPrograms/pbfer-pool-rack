import { BRAND, SPECS } from "./brand";

export const PRODUCT = {
  id: "pbfer-rack",
  name: BRAND.product,
  slug: "the-rack",
  priceCents: BRAND.priceCents,
  description:
    "A folding nylon rack that holds a tight 15-ball pack. Locks open. Packs flat. No pretending.",
  specs: SPECS,
};

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
