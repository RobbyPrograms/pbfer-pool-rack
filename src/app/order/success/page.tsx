import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; orderId?: string }>;
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
          Square has the receipt. We have the order. You&apos;ll get a
          shipping note when it leaves the bench — not a week of silence.
        </p>
        <SuccessSession searchParams={searchParams} />
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="ember-btn">
            Back to the rack
          </Link>
          <Link href="/#shop" className="ghost-btn">
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
  searchParams: Promise<{ session_id?: string; orderId?: string }>;
}) {
  const params = await searchParams;
  const ref = params.orderId || params.session_id;
  if (!ref) return null;
  return (
    <p className="mt-6 font-display text-[0.7rem] uppercase tracking-[0.16em] text-paper-mute">
      Ref {ref.slice(0, 18)}
    </p>
  );
}
