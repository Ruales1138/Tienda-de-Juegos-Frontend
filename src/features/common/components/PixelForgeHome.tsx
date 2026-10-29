"use client";

import { useMemo, useState } from "react";
import { Pagination } from "./Pagination";
import { SectionHeading } from "./SectionHeading";
import { SolicitudForm } from "../../solicitudes/components/SolicitudForm";
import { useVideojuegos } from "../../videojuegos/hooks/useVideojuegos";
import { VideojuegoCard } from "../../videojuegos/components/VideojuegoCard";

const categories = ["todos", "aventura", "accion", "rol"] as const;

export function PixelForgeHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const value = Number(new URLSearchParams(window.location.search).get("page"));
    return Number.isInteger(value) && value > 0 ? value : 1;
  });
  const [category, setCategory] = useState<(typeof categories)[number]>("todos");
  const { data, loading, error } = useVideojuegos(page);

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
                {juegos.map((juego) => <VideojuegoCard key={juego.id} juego={juego} />)}
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

      <footer className="border-t border-slate-800 bg-[#0b121f] px-6 py-8 text-center text-sm text-slate-400">
        © 2026 Pixel Forge. Tienda independiente de videojuegos.
      </footer>
    </div>
  );
}
