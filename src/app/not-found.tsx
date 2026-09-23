import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80svh] max-w-xl flex-col justify-center px-5">
      <p className="kicker">404</p>
      <h1 className="display mt-4 text-5xl">Off the table.</h1>
      <p className="mt-4 text-paper-mute">
        That page isn&apos;t here. The rack still is.
      </p>
      <Link href="/" className="ember-btn mt-8 w-fit">
        Back home
      </Link>
    </main>
  );
}
