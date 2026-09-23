import type { Metadata } from "next";
import { Instrument_Sans, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    "A machined pool rack that actually racks tight. 6061 aluminum, 0.2 mm corners, no warp.",
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: "The first rack that treats tightness like a tolerance, not a vibe.",
    images: ["/og"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} bg-ink text-paper antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
