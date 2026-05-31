import { useEffect, useMemo, useState } from "react";
import { getReviews } from "../../services/ReviewService";
import type { GameData } from "../../types/Game";
import Post from "../../components/Post";
import { useSearch } from "../../context/SearchContext";

export default function Feed() {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const data = await getReviews();
        if (active) setGames(data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchData();
    return () => {
      active = false;
    };
  }, []);

  const filteredGames = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return games;

    return games.filter((game) => {
      const matchName = game.nombre.toLowerCase().includes(term);
      const matchUser = game.reseñas.some((review) =>
        (review.usuario ?? "").toLowerCase().includes(term)
      );
      const matchReview = game.reseñas.some((review) =>
        (review.reseña ?? "").toLowerCase().includes(term)
      );
      return matchName || matchUser || matchReview;
    });
  }, [games, searchTerm]);

  return (
    <div id="feed-page" className="page-container py-8 md:py-10">
      <h1 className="feed-heading">Explore!</h1>
      <p className="feed-subheading">Connect with the community</p>

      {searchTerm && !loading && (
        <p className="text-voltra-text/50 text-sm mt-4">
          Resultados para: <span className="text-voltra-text font-medium">"{searchTerm}"</span>
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent" />
        </div>
      ) : (
        <>
          <div
            id="posts-container"
            className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
          >
            {filteredGames.map((game: GameData) => (
              <Post key={String(game.id)} game={game} />
            ))}
          </div>

          {filteredGames.length === 0 && (
            <p className="text-voltra-text/60 text-center py-16">
              {searchTerm ? "No se encontraron publicaciones." : "No hay publicaciones disponibles."}
            </p>
          )}
        </>
      )}
    </div>
  );
}
