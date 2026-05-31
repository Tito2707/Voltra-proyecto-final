export type Review = {
  usuario: string;
  reseña: string;
};

export type GameData = {
  id: number | string;
  nombre: string;
  imagen: string;
  likes: number;
  ranking_estrellas: number;
  reseñas: Review[];
};
