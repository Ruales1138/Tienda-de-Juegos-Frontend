import { http } from "../../common/http";
import type { Solicitud } from "../domain/solicitud";

export function createSolicitud(videojuegoId: string, message: string) {
  return http<{ data: Solicitud }>("/solicitudes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videojuegoId, message }),
  });
}

export function getMySolicitudes() {
  return http<{ data: Solicitud[] }>("/solicitudes/mias");
}

export function getAllSolicitudes() {
  return http<{ data: Solicitud[] }>("/solicitudes");
}
