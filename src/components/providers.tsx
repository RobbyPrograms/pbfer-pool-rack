"use client";

import { ShopTalkProvider } from "@/components/easter-egg/ShopTalk";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <ShopTalkProvider>{children}</ShopTalkProvider>;
}
