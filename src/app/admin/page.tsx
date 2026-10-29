"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { getAllSolicitudes } from "@/features/solicitudes/services/solicitud-service";
import type { Solicitud } from "@/features/solicitudes/domain/solicitud";

function AdminContent() {
  const [items, setItems] = useState<Solicitud[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    getAllSolicitudes().then((result) => setItems(result.data)).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "No se pudieron cargar las solicitudes."));
  }, []);
  return (
    <main className="min-h-screen bg-[#080d16] px-6 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-amber-300">← Pixel Forge</Link>
        <h1 className="mt-8 text-4xl font-black">Administración</h1>
        {error ? <p className="mt-6 text-red-300">{error}</p> : <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-700"><table className="w-full text-left text-sm"><thead className="bg-slate-900 text-teal-300"><tr><th className="p-4">Usuario</th><th className="p-4">Videojuego</th><th className="p-4">Mensaje</th><th className="p-4">Fecha</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-t border-slate-700"><td className="p-4">{item.userId}</td><td className="p-4">{item.videojuegoId}</td><td className="p-4">{item.message}</td><td className="p-4">{new Date(item.createdAt).toLocaleDateString("es-CO")}</td></tr>)}</tbody></table></div>}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return <AuthGuard adminOnly><AdminContent /></AuthGuard>;
}
