export type Solicitud = {
  id: string;
  message: string;
  userId: string;
  videojuegoId: string;
  user?: { name: string };
  videojuego?: { name: string };
  createdAt: string;
};
