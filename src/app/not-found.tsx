import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d16] px-6 text-center text-slate-100">
      <div>
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-teal-300">
          Pixel Forge
        </p>
        <h1 className="mt-4 text-6xl font-black">404</h1>
        <p className="mt-4 text-slate-300">Esta página no existe.</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-teal-300 px-6 py-3 font-extrabold text-slate-950"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
