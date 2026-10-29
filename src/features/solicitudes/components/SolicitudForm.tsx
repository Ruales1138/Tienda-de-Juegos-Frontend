"use client";

import { useState } from "react";
import type { Videojuego } from "../../videojuegos/domain/videojuego";

export function SolicitudForm({ juegos }: { juegos: Videojuego[] }) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("Tu consulta está lista. Inicia sesión para enviarla.");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-slate-200">
          Nombre completo
          <input
            name="name"
            required
            minLength={2}
            className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal text-white outline-none transition focus:border-teal-300"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-200">
          Correo electrónico
          <input
            name="email"
            type="email"
            required
            className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal text-white outline-none transition focus:border-teal-300"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-slate-200">
        Videojuego de interés
        <select
          name="videojuego"
          required
          defaultValue=""
          className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal text-white outline-none transition focus:border-teal-300"
        >
          <option value="" disabled>
            Selecciona un videojuego
          </option>
          {juegos.map((juego) => (
            <option key={juego.id} value={juego.id}>
              {juego.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-bold text-slate-200">
        Mensaje
        <textarea
          name="message"
          required
          minLength={10}
          rows={4}
          className="rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-normal text-white outline-none transition focus:border-teal-300"
        />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-coral px-6 py-3 font-extrabold text-slate-950 transition hover:bg-orange-300"
        >
          Preparar consulta
        </button>
        {status ? (
          <p role="status" className="text-sm font-bold text-teal-300">
            {status}
          </p>
        ) : null}
      </div>
    </form>
  );
}
