import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function OrderCancelledPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[80svh] max-w-2xl flex-col justify-center px-5 py-32">
        <p className="kicker">Cancelled</p>
        <h1 className="display mt-4 text-5xl sm:text-7xl">
          Nothing
          <br />
          charged.
        </h1>
        <p className="mt-6 text-lg text-paper-mute">
          Checkout closed. The rack is still here. If Stripe felt like too
          much commitment for a Tuesday, that&apos;s fair.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/#buy" className="ember-btn">
            Try again
          </Link>
          <Link href="/#fold" className="ghost-btn">
            See it fold
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
