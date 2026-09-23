import { NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { waitlistMemory } from "@/lib/waitlist-memory";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({
      count: waitlistMemory.length,
      cap: BRAND.waitlistCap,
      demo: true,
    });
  }

  const { count, error } = await admin
    .from("waitlist")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ count: 0, cap: BRAND.waitlistCap });
  }

  return NextResponse.json({
    count: count ?? 0,
    cap: BRAND.waitlistCap,
  });
}
