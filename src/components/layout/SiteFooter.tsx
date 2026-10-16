import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line bg-ink-raised">
      <div className="mx-auto max-w-site px-5 py-16 md:px-8">
        <div className="grid gap-14 md:grid-cols-[1.2fr_0.8fr]">
          <WaitlistForm />
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="kicker">Elsewhere</p>
              <ul className="mt-4 space-y-2 font-display text-lg">
                <li>
                  <a
                    href="https://instagram.com"
                    className="hover:text-ember"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com"
                    className="hover:text-ember"
                    rel="noreferrer"
                    target="_blank"
                  >
                    X / Twitter
                  </a>
                </li>
                <li>
                  <Link href="/og?stat=fold" className="hover:text-ember">
                    Spec card
                  </Link>
                </li>
              </ul>
            </div>
            <nav className="flex flex-wrap gap-5 text-sm text-paper-mute">
              <Link href="#specs">Specs</Link>
              <Link href="#founder">Note</Link>
              <Link href="#buy">Buy</Link>
              <Link href="/order/success">Orders</Link>
            </nav>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-end justify-between gap-4 border-t border-ink-line pt-6 text-xs text-paper-mute">
          <img
            src="/brand/built-tree.png"
            alt="Built Tree"
            className="h-5 w-auto"
          />
          <p>© {new Date().getFullYear()} · One product. Built like we meant it.</p>
        </div>
      </div>
    </footer>
  );
}
