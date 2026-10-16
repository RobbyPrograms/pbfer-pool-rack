import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[80svh] max-w-2xl flex-col justify-center px-5 py-32">
        <p className="kicker">Paid</p>
        <h1 className="display mt-4 text-5xl sm:text-7xl">
          You bought
          <br />
          two rails.
        </h1>
        <p className="mt-6 text-lg text-paper-mute">
          Stripe has the receipt. We have the order. You&apos;ll get a
          shipping note when it leaves the bench — not a week of silence.
        </p>
        <SuccessSession searchParams={searchParams} />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="ember-btn">
            Back to the rack
          </Link>
          <Link href="/#buy" className="ghost-btn">
            Buy another
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function SuccessSession({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) return null;
  return (
    <p className="mt-6 font-display text-[0.7rem] uppercase tracking-[0.16em] text-paper-mute">
      Ref {session_id.slice(0, 18)}
    </p>
  );
}
