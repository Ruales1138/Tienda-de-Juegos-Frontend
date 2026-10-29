type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación del catálogo" className="mt-10 flex items-center justify-center gap-4">
      <button
        type="button"
        className="rounded-full border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-teal-300 hover:text-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      <span className="text-sm font-bold text-slate-300">
        Página {page} de {totalPages}
      </span>
      <button
        type="button"
        className="rounded-full border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-teal-300 hover:text-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  );
}
