import { NextResponse } from "next/server";
import { BRAND } from "@/lib/brand";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { waitlistMemory } from "@/lib/waitlist-memory";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!rateLimit(`waitlist:${clientKey(request)}`, 5, 60_000)) {
    return NextResponse.json({ error: "Slow down a second." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
    name?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase() ?? "";
  const name = body?.name?.trim().slice(0, 80) || null;

  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "That email looks off." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  if (!admin) {
    const existing = waitlistMemory.find((r) => r.email === email);
    if (existing) {
      return NextResponse.json({
        spot: existing.spot,
        count: waitlistMemory.length,
        demo: true,
      });
    }
    const spot = waitlistMemory.length + 1;
    waitlistMemory.push({ email, name, spot });
    return NextResponse.json({
      spot,
      count: waitlistMemory.length,
      demo: true,
    });
  }

  const { count: existingCount } = await admin
    .from("waitlist")
    .select("*", { count: "exact", head: true });

  const nextSpot = (existingCount ?? 0) + 1;

  const { data, error } = await admin
    .from("waitlist")
    .insert({ email, name, spot_number: nextSpot })
    .select("spot_number")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: row } = await admin
        .from("waitlist")
        .select("spot_number")
        .eq("email", email)
        .single();
      return NextResponse.json({
        spot: row?.spot_number ?? null,
        count: existingCount ?? nextSpot,
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    spot: data.spot_number,
    count: nextSpot,
    etched: nextSpot <= BRAND.waitlistCap,
  });
}
