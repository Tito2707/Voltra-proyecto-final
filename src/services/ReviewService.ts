import { supabase } from "../supabaseClient";
import type { GameData } from "../types/Game";

type FeedRow = {
  id: string | number;
  game_name?: string | null;
  image_url?: string | null;
  likes?: number | null;
  ranking_estrellas?: number | null;
  usuario?: string | null;
  content?: string | null;
};

export const mapFeedRow = (post: FeedRow): GameData => ({
  id: post.id,
  nombre: post.game_name ?? "Sin título",
  imagen: post.image_url ?? "/minecraft.jpg",
  likes: post.likes ?? 0,
  ranking_estrellas: post.ranking_estrellas ?? 0,
  reseñas: [
    {
      usuario: post.usuario ?? "Usuario",
      reseña: post.content ?? "",
    },
  ],
});

const loadLocalGames = async (): Promise<GameData[]> => {
  try {
    const res = await fetch("/data/games.json");
    if (!res.ok) return [];
    return (await res.json()) as GameData[];
  } catch {
    return [];
  }
};

const getReviews = async (): Promise<GameData[]> => {
  const { data, error } = await supabase.from("feed").select("*");

  if (!error && data && data.length > 0) {
    return data.map((post) => mapFeedRow(post as FeedRow));
  }

  if (error) {
    console.error("Error cargando feed de Supabase:", error.message);
  }

  return loadLocalGames();
};

export { getReviews };
