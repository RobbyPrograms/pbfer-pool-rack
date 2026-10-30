import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const industry = localFont({
  src: [
    { path: "../fonts/industry/Industry-Thin.ttf", weight: "100", style: "normal" },
    { path: "../fonts/industry/Industry-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "../fonts/industry/Industry-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/industry/Industry-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../fonts/industry/Industry-Book.ttf", weight: "400", style: "normal" },
    { path: "../fonts/industry/Industry-BookItalic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/industry/Industry-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/industry/Industry-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../fonts/industry/Industry-Demi.ttf", weight: "600", style: "normal" },
    { path: "../fonts/industry/Industry-DemiItalic.ttf", weight: "600", style: "italic" },
    { path: "../fonts/industry/Industry-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/industry/Industry-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../fonts/industry/Industry-Black.ttf", weight: "900", style: "normal" },
    { path: "../fonts/industry/Industry-BlackItalic.ttf", weight: "900", style: "italic" },
    { path: "../fonts/industry/Industry-Ultra.ttf", weight: "950", style: "normal" },
    { path: "../fonts/industry/Industry-UltraItalic.ttf", weight: "950", style: "italic" },
  ],
  variable: "--font-industry",
  display: "swap",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "A folding pool rack that actually racks tight. Two printed rails, locks open on the table cushion, packs flat.",
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: "Two rails. One pin. The table does the rest.",
    images: ["/og"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og"],
  },
  icons: {
    icon: [{ url: "/brand/bt-icon.png", type: "image/png", sizes: "256x256" }],
    apple: [{ url: "/brand/bt-apple.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${industry.variable} bg-ink text-paper antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
