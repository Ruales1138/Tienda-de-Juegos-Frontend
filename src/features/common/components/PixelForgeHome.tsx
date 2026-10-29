"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Pagination } from "./Pagination";
import { SectionHeading } from "./SectionHeading";
import { SolicitudForm } from "../../solicitudes/components/SolicitudForm";
import { useVideojuegos } from "../../videojuegos/hooks/useVideojuegos";
import { VideojuegoCard } from "../../videojuegos/components/VideojuegoCard";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import type { Videojuego } from "../../videojuegos/domain/videojuego";

const categories = ["todos", "aventura", "accion", "rol"] as const;

export function PixelForgeHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const value = Number(new URLSearchParams(window.location.search).get("page"));
    return Number.isInteger(value) && value > 0 ? value : 1;
  });
  const [category, setCategory] = useState<(typeof categories)[number]>("todos");
  const [selectedGame, setSelectedGame] = useState<Videojuego | null>(null);
  const { data, loading, error } = useVideojuegos(page);
  const { user, logout } = useAuth();

  const juegos = useMemo(
    () =>
      data?.data.filter(
        (juego) => category === "todos" || juego.category === category,
      ) ?? [],
    [category, data],
  );

  function changePage(nextPage: number) {
    setPage(nextPage);
    window.history.pushState({}, "", `/?page=${nextPage}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectCategory(nextCategory: (typeof categories)[number]) {
    setCategory(nextCategory);
    document.querySelector("#catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedGame(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen bg-[#080d16] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-[#0b121f]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#inicio" className="text-xl font-black tracking-tight text-amber-300">
            Pixel Forge
          </a>
          <button
            type="button"
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-bold md:hidden"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menú
          </button>
          <div
            className={`${menuOpen ? "flex" : "hidden"} absolute left-0 top-full w-full flex-col gap-4 border-b border-slate-800 bg-[#0b121f] px-6 py-5 md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0`}
          >
            <a href="#inicio" className="font-bold text-slate-200 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Inicio</a>
            <a href="#catalogo" className="font-bold text-slate-200 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Catálogo</a>
            <a href="#categorias" className="font-bold text-slate-200 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Categorías</a>
            <a href="#contacto" className="font-bold text-slate-200 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Contacto</a>
            {user ? <a href="/mis-solicitudes" className="font-bold text-slate-200 hover:text-teal-300">Mis solicitudes</a> : <a href="/login" className="font-bold text-slate-200 hover:text-teal-300">Ingresar</a>}
            {user?.role === "ADMIN" ? <a href="/admin" className="font-bold text-amber-300 hover:text-amber-200">Administración</a> : null}
            {user ? <button type="button" onClick={logout} className="text-left font-bold text-coral hover:text-orange-300">Salir ({user.name})</button> : null}
          </div>
        </nav>
      </header>

      <main>
        <section id="inicio" className="relative overflow-hidden border-b border-slate-800 bg-[radial-gradient(circle_at_15%_20%,rgba(37,208,177,0.18),transparent_35%),linear-gradient(120deg,#101827,#152e63)] px-6 py-28 sm:py-36">
          <div className="relative mx-auto max-w-6xl">
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.25em] text-teal-300">
              Tienda independiente de videojuegos
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl">
              Encuentra tu próxima aventura
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Explora una selección de videojuegos para diferentes plataformas y
              descubre nuevas experiencias para jugar.
            </p>
            <a href="#catalogo" className="mt-8 inline-block rounded-full bg-teal-300 px-6 py-3 font-extrabold text-slate-950 transition hover:bg-teal-200">
              Ver catálogo
            </a>
          </div>
        </section>

        <section id="catalogo" className="mx-auto max-w-6xl px-6 py-20">
          <SectionHeading
            eyebrow="Descubre"
            title="Catálogo destacado"
            description="El catálogo se carga desde la API y conserva los juegos originales de Pixel Forge."
          />
          {loading ? (
            <p className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-slate-300">Cargando catálogo...</p>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/40 bg-red-950/30 p-8">
              <p className="font-bold text-red-200">No pudimos cargar el catálogo.</p>
              <p className="mt-2 text-sm text-red-300">{error}</p>
            </div>
          ) : juegos.length === 0 ? (
            <p className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-slate-300">No hay videojuegos en esta categoría.</p>
          ) : (
            <>
              <div className="mb-8 flex flex-wrap gap-3" aria-label="Filtrar catálogo">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={category === item}
                    onClick={() => selectCategory(item)}
                    className={`rounded-full px-4 py-2 text-sm font-extrabold capitalize transition ${category === item ? "bg-teal-300 text-slate-950" : "border border-slate-600 text-slate-300 hover:border-teal-300 hover:text-teal-300"}`}
                  >
                    {item === "todos" ? "Todos" : item}
                  </button>
                ))}
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {juegos.map((juego) => <VideojuegoCard key={juego.id} juego={juego} onDetails={setSelectedGame} />)}
              </div>
              {data ? <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={changePage} /> : null}
            </>
          )}
        </section>

        <section id="categorias" className="border-y border-slate-800 bg-[#0f1725] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="Elige tu estilo" title="Categorías para cada jugador" />
            <div className="grid gap-4 sm:grid-cols-3">
              {categories.slice(1).map((item) => (
                <button key={item} type="button" onClick={() => selectCategory(item)} className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-left font-black capitalize text-white transition hover:border-teal-300 hover:text-teal-300">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="mx-auto max-w-3xl px-6 py-20">
          <SectionHeading eyebrow="Hablemos" title="Contáctanos" description="Escríbenos para consultar disponibilidad o solicitar una reserva." />
          <SolicitudForm juegos={data?.data ?? []} />
        </section>
      </main>

      {selectedGame ? (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-slate-950/80 p-6 backdrop-blur-sm"
          role="presentation"
          onClick={() => setSelectedGame(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-details-title"
            className="grid max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl border border-slate-700 bg-[#0f1725] shadow-2xl md:grid-cols-2"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-64 bg-slate-800">
              <Image
                src={selectedGame.imageUrl}
                alt={selectedGame.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-5 p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-teal-300">
                    {selectedGame.categoryName}
                  </p>
                  <h2 id="game-details-title" className="mt-2 text-3xl font-black text-white">
                    {selectedGame.name}
                  </h2>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar detalles"
                  onClick={() => setSelectedGame(null)}
                  className="rounded-full border border-slate-600 px-3 py-1 text-xl text-slate-300 hover:border-teal-300 hover:text-teal-300"
                >
                  ×
                </button>
              </div>
              <p className="leading-7 text-slate-300">{selectedGame.description}</p>
              <dl className="space-y-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Plataformas</dt>
                  <dd className="text-right font-bold text-slate-100">{selectedGame.platforms}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Categoría</dt>
                  <dd className="font-bold text-slate-100">{selectedGame.categoryName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Precio</dt>
                  <dd className="font-black text-amber-300">${selectedGame.price.toLocaleString("es-CO")} COP</dd>
                </div>
              </dl>
              <a
                href="#contacto"
                onClick={() => setSelectedGame(null)}
                className="inline-block rounded-full bg-teal-300 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-teal-200"
              >
                Consultar disponibilidad
              </a>
            </div>
          </section>
        </div>
      ) : null}

      <footer className="border-t border-slate-800 bg-[#0b121f] px-6 py-8 text-center text-sm text-slate-400">
        © 2026 Pixel Forge. Tienda independiente de videojuegos.
      </footer>
    </div>
  );
}
