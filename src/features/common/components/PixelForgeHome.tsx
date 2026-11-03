"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Pagination } from "./Pagination";
import { SectionHeading } from "./SectionHeading";
import { Cart } from "../../solicitudes/components/Cart";
import { useVideojuegos } from "../../videojuegos/hooks/useVideojuegos";
import { VideojuegoCard } from "../../videojuegos/components/VideojuegoCard";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import { getStoredAvatar, subscribeToAvatar } from "../../../features/auth/profile-avatar";
import type { Videojuego } from "../../videojuegos/domain/videojuego";

const categories = ["todos", "aventura", "accion", "rol"] as const;

export function PixelForgeHome({ view = "home" }: { view?: "home" | "catalog" }) {
  const isCatalogView = view === "catalog";
  const [menuOpen, setMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [page, setPage] = useState(() => {
    if (typeof window === "undefined") return 1;
    const value = Number(new URLSearchParams(window.location.search).get("page"));
    return Number.isInteger(value) && value > 0 ? value : 1;
  });
  const [category, setCategory] = useState<(typeof categories)[number]>("todos");
  const [selectedGame, setSelectedGame] = useState<Videojuego | null>(null);
  const [cart, setCart] = useState<Videojuego[]>([]);
  const avatar = useSyncExternalStore(subscribeToAvatar, getStoredAvatar, () => null);
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

  function addToCart(juego: Videojuego) {
    setCart((items) =>
      items.some((item) => item.id === juego.id) ? items : [...items, juego],
    );
    setSelectedGame(null);
    setSideMenuOpen(true);
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
            className={`${menuOpen ? "flex" : "hidden"} absolute left-0 top-full w-full flex-col gap-4 border-b border-slate-800 bg-[#0b121f] px-6 py-5 md:static md:flex md:w-auto md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`}
          >
            <Link href="/" className="font-bold text-slate-200 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Inicio</Link>
            <Link href="/catalogo" className="font-bold text-slate-200 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Catálogo</Link>
            <div className="flex flex-col gap-4 md:ml-auto md:flex-row md:items-center">
              <button
                type="button"
                aria-label={`Abrir carrito (${cart.length} productos)`}
                aria-expanded={sideMenuOpen}
                onClick={() => setSideMenuOpen(true)}
                className="rounded-full border border-slate-600 px-3 py-1 text-sm font-bold text-slate-200 hover:border-teal-300 hover:text-teal-300"
              >
                🛒 {cart.length}
              </button>
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    aria-label="Abrir menú de perfil"
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((open) => !open)}
                    className="h-11 w-11 overflow-hidden rounded-full border-2 border-teal-300 bg-slate-900 transition hover:border-amber-300"
                  >
                    <Image
                      src={avatar ?? "/profile-avatar.svg"}
                      alt="Avatar del perfil"
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  {profileOpen ? (
                    <div className="absolute right-0 top-14 z-30 w-64 rounded-2xl border border-slate-700 bg-[#0f1725] p-4 shadow-2xl">
                      <p className="font-black text-white">{user.name}</p>
                      <p className="mt-1 truncate text-sm text-slate-400">{user.email}</p>
                      <div className="mt-4 grid gap-2 border-t border-slate-700 pt-4">
                        <a href="/mis-solicitudes" onClick={() => setProfileOpen(false)} className="rounded-xl px-3 py-2 font-bold text-slate-200 hover:bg-slate-800 hover:text-teal-300">Mis solicitudes</a>
                        <Link href="/perfil" onClick={() => setProfileOpen(false)} className="rounded-xl px-3 py-2 font-bold text-slate-200 hover:bg-slate-800 hover:text-teal-300">Ver perfil</Link>
                        {user.role === "ADMIN" ? <a href="/admin" onClick={() => setProfileOpen(false)} className="rounded-xl px-3 py-2 font-bold text-amber-300 hover:bg-slate-800">Administración</a> : null}
                        <button type="button" onClick={logout} className="rounded-xl px-3 py-2 text-left font-bold text-coral hover:bg-slate-800">Cerrar sesión</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : <a href="/login" className="font-bold text-slate-200 hover:text-teal-300">Ingresar</a>}
            </div>
          </div>
        </nav>
      </header>

      <main>
        {!isCatalogView ? <section
          id="inicio"
          className="relative overflow-hidden border-b border-slate-800 bg-cover bg-center px-6 py-28 sm:py-36"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8, 13, 22, 0.94), rgba(8, 13, 22, 0.62)), url('/pixel-forge-background.png')",
          }}
        >
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
            <Link href="/catalogo" className="mt-8 inline-block rounded-full bg-teal-300 px-6 py-3 font-extrabold text-slate-950 transition hover:bg-teal-200">
              Ver catálogo
            </Link>
          </div>
        </section> : null}

        {isCatalogView ? <section id="catalogo" className="mx-auto max-w-6xl px-6 py-20">
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
                {juegos.map((juego) => <VideojuegoCard key={juego.id} juego={juego} onDetails={setSelectedGame} onAddToCart={addToCart} />)}
              </div>
              {data ? <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={changePage} /> : null}
            </>
          )}
        </section> : null}

      </main>

      {sideMenuOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/70" role="presentation" onClick={() => setSideMenuOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-slate-700 bg-[#0f1725] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="side-cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 id="side-cart-title" className="text-2xl font-black text-white">Carrito</h2>
              <button
                type="button"
                aria-label="Cerrar menú lateral"
                onClick={() => setSideMenuOpen(false)}
                className="rounded-full border border-slate-600 px-3 py-1 text-xl text-slate-300 hover:border-teal-300 hover:text-teal-300"
              >
                ×
              </button>
            </div>
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-black text-teal-300">
                Productos ({cart.length})
              </h3>
              <Cart
                items={cart}
                onRemove={(id) =>
                  setCart((items) => items.filter((item) => item.id !== id))
                }
                onClear={() => setCart([])}
              />
            </div>
          </aside>
        </div>
      ) : null}

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
                href="#carrito"
                onClick={(event) => {
                  event.preventDefault();
                  addToCart(selectedGame);
                }}
                className="inline-block rounded-full bg-teal-300 px-5 py-3 font-extrabold text-slate-950 transition hover:bg-teal-200"
              >
                Agregar al carrito
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
