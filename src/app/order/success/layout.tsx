import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You're in",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
