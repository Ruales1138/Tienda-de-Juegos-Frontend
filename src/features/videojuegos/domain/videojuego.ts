export type Videojuego = {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  description: string;
  platforms: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
};

export type CatalogResponse = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: Videojuego[];
};
