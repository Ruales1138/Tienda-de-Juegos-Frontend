"use client";

import { useEffect, useState } from "react";
import type { CatalogResponse } from "../domain/videojuego";
import { getVideojuegos } from "../services/videojuegos-service";

type CatalogState = {
  data: CatalogResponse | null;
  loadedPage: number | null;
  error: string | null;
};

type CatalogViewState = {
  data: CatalogResponse | null;
  loading: boolean;
  error: string | null;
};

export function useVideojuegos(page: number): CatalogViewState {
  const [state, setState] = useState<CatalogState>({
    data: null,
    loadedPage: null,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getVideojuegos(page)
      .then((data) => {
        if (active) setState({ data, loadedPage: page, error: null });
      })
      .catch((error: unknown) => {
        if (active) {
          setState((previous) => ({
            data: previous.data,
            loadedPage: page,
            error:
              error instanceof Error
                ? error.message
                : "No se pudo cargar el catálogo.",
          }));
        }
      });

    return () => {
      active = false;
    };
  }, [page]);

  return {
    data: state.data,
    loading: state.loadedPage !== page,
    error: state.loadedPage === page ? state.error : null,
  };
}
