import { http } from "../../common/http";
import type { CatalogResponse } from "../domain/videojuego";

export function getVideojuegos(page: number, limit = 6) {
  return http<CatalogResponse>(`/videojuegos?page=${page}&limit=${limit}`);
}
