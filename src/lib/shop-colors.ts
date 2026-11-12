const black = ["1271", "1329", "1336", "1356"];

export const SHOP_COLORS = [
  { name: "Black", hex: "#1e2a2c", photos: black, placeholder: false },
  { name: "Blue", hex: "#177dc3", photos: black, placeholder: true },
  { name: "Purple", hex: "#6560af", photos: black, placeholder: true },
  { name: "Light Blue", hex: "#72b5dd", photos: black, placeholder: true },
  { name: "Burgundy", hex: "#8e4944", photos: ["1267", "1331", "1332", "1363"], placeholder: false },
  { name: "Green", hex: "#53a15b", photos: ["1264", "1328", "1333", "1360"], placeholder: false },
  { name: "Gray", hex: "#5e7881", photos: black, placeholder: true },
] as const;

export type ShopColor = (typeof SHOP_COLORS)[number];
