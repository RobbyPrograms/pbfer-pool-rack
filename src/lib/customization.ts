export const CUSTOM_PRICE_CENTS = 5999;
export const MAX_ORDER_QUANTITY = 100;
export const MAX_LOGO_BYTES = 3 * 1024 * 1024;
export const CUSTOM_FONTS = [
  { id: "industry-book", label: "Industry Book", weight: 400 },
  { id: "industry-demi", label: "Industry Demi", weight: 600 },
  { id: "industry-bold", label: "Industry Bold", weight: 700 },
  { id: "industry-black", label: "Industry Black", weight: 900 },
] as const;

export function validateName(name: unknown, font: unknown) {
  if (typeof name !== "string" || !name.trim() || name.trim().length > 40 || /[\r\n\x00-\x1f]/.test(name)) {
    throw new Error("Enter a name between 1 and 40 characters.");
  }
  const selectedFont = CUSTOM_FONTS.find((item) => item.id === font);
  if (!selectedFont) throw new Error("Select a font for your name.");
  return { name: name.trim(), font: selectedFont };
}

export function logoFormat(bytes: Uint8Array): { extension: string; mime: string } | null {
  const starts = (signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  if (starts([137, 80, 78, 71, 13, 10, 26, 10])) return { extension: "png", mime: "image/png" };
  if (starts([255, 216, 255])) return { extension: "jpg", mime: "image/jpeg" };
  if (starts([37, 80, 68, 70, 45])) return { extension: "pdf", mime: "application/pdf" };
  if (starts([82, 73, 70, 70]) && [87, 69, 66, 80].every((byte, index) => bytes[index + 8] === byte)) return { extension: "webp", mime: "image/webp" };
  return null;
}
