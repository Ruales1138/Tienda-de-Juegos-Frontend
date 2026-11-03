"use client";

import { useState } from "react";
import type { Videojuego } from "../../videojuegos/domain/videojuego";
import { createSolicitud } from "../services/solicitud-service";

export function Cart({
  items,
  onRemove,
  onClear,
}: {
  items: Videojuego[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  async function submitCart() {
    if (items.length === 0 || pending) return;
    setPending(true);
    setStatus("");
    try {
      await Promise.all(
        items.map((item) =>
          createSolicitud(
            item.id,
            `Solicitud de compra para ${item.name}.`,
          ),
        ),
      );
      onClear();
      setStatus("Tu solicitud de compra fue enviada correctamente.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la solicitud de compra.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
      {items.length === 0 ? (
        <p className="text-slate-300">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="grid gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4"
              >
                <div>
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-sm text-amber-300">
                    ${item.price.toLocaleString("es-CO")} COP
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-sm font-bold text-coral hover:text-orange-300"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={submitCart}
              disabled={pending}
              className="rounded-full bg-teal-300 px-6 py-3 font-extrabold text-slate-950 transition hover:bg-teal-200 disabled:opacity-50"
            >
              {pending ? "Enviando..." : "Solicitar compra"}
            </button>
            <button
              type="button"
              onClick={onClear}
              className="rounded-full border border-slate-600 px-5 py-3 font-bold text-slate-200 hover:border-teal-300 hover:text-teal-300"
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
      {status ? (
        <p role="status" className="mt-4 text-sm font-bold text-teal-300">
          {status}
        </p>
      ) : null}
    </div>
  );
}
