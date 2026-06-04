import { supabase } from "../supabaseClient";

export type GameSuggestion = {
  id: string;
  title: string;
  cover_url: string;
};

export async function searchGames(term: string): Promise<GameSuggestion[]> {
  if (term.trim().length < 2) return [];

  const { data, error } = await supabase
    .from("games")
    .select("id,title,cover_url")
    .ilike("title", `${term}%`)
    .limit(5);

  if (error) {
    console.error("Error buscando juegos:", error.message);
    return [];
  }

  return data || [];
}