import Image from "next/image";
import type { Videojuego } from "../domain/videojuego";

export function VideojuegoCard({
  juego,
  onDetails,
}: {
  juego: Videojuego;
  onDetails: (juego: Videojuego) => void;
}) {
  function openDetails() {
    onDetails(juego);
  }

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80 shadow-2xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-teal-300/70"
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetails();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative h-52 overflow-hidden bg-slate-800">
        <Image
          src={juego.imageUrl}
          alt={juego.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-teal-300">
          {juego.categoryName}
        </span>
      </div>
      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-xl font-black text-white">{juego.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{juego.description}</p>
        </div>
        <p className="text-sm text-slate-400">
          Plataformas: <span className="text-slate-200">{juego.platforms}</span>
        </p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-black text-amber-300">
            ${juego.price.toLocaleString("es-CO")} COP
          </p>
          <a
            href="#contacto"
            onClick={(event) => event.stopPropagation()}
            className="rounded-full bg-teal-300 px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-teal-200"
          >
            Consultar
          </a>
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openDetails();
          }}
          className="w-full rounded-full border border-slate-600 px-4 py-2 text-sm font-extrabold text-slate-200 transition hover:border-teal-300 hover:text-teal-300"
        >
          Ver detalles
        </button>
      </div>
    </article>
  );
}
