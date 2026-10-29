"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { getMySolicitudes } from "@/features/solicitudes/services/solicitud-service";
import type { Solicitud } from "@/features/solicitudes/domain/solicitud";

function MyRequestsContent() {
  const [items, setItems] = useState<Solicitud[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getMySolicitudes().then((result) => setItems(result.data)).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "No se pudieron cargar tus solicitudes."));
  }, []);
  return (
    <main className="min-h-screen bg-[#080d16] px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-amber-300">← Pixel Forge</Link>
        <h1 className="mt-8 text-4xl font-black">Mis solicitudes</h1>
        {error ? <p className="mt-6 text-red-300">{error}</p> : items.length === 0 ? <p className="mt-6 text-slate-300">Todavía no tienes solicitudes.</p> : <div className="mt-8 grid gap-4">{items.map((item) => <article key={item.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-5"><p className="text-sm text-slate-400">{new Date(item.createdAt).toLocaleString("es-CO")}</p><p className="mt-2 text-slate-100">{item.message}</p><p className="mt-3 text-sm text-teal-300">Videojuego: {item.videojuegoId}</p></article>)}</div>}
      </div>
    </main>
  );
}

export default function MyRequestsPage() {
  return <AuthGuard><MyRequestsContent /></AuthGuard>;
}
