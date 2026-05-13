import { useEffect, useState } from "react";
import { getReviews } from "../services/ReviewService";
import PostInteraction from "./PostInteraction";

interface Review {
  usuario: string;
  reseña: string;
}

interface GameData {
  nombre: string;
  imagen: string;
  likes: number;
  ranking_estrellas: number;
  reseñas: Review[];
}

export default function Post() {
  const [games, setGames] = useState<GameData[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setGames(await getReviews<GameData>());
      } catch {
        setGames([]);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {games.map((game) => (
          <div
            key={game.nombre}
            className="bg-voltra-bg rounded-xl overflow-hidden border border-voltra-border-soft shadow-lg max-w-sm w-full text-voltra-text transition-transform transform hover:scale-105 flex flex-col"
          >
            <img
              src={game.imagen}
              alt={game.nombre}
              className="w-full h-40 sm:h-44 object-cover"
            />
            <div className="p-5 flex flex-col justify-between flex-1">
              {game.reseñas && game.reseñas.length > 0 && (
                <>
                  <div>
                    <div className="flex items-center mb-3">
                      <img
                        src={`https://i.pravatar.cc/100?u=${game.reseñas[0].usuario}`}
                        alt={game.reseñas[0].usuario}
                        className="w-10 h-10 rounded-full mr-3 border border-voltra-border-soft"
                      />
                      <h2 className="font-bold text-lg">{game.reseñas[0].usuario}</h2>
                    </div>
                    <p className="text-voltra-muted text-sm text-left leading-relaxed">{game.reseñas[0].reseña}</p>
                  </div>
                  <div className="mt-4">
                    <PostInteraction initialLikes={game.likes} ranking={game.ranking_estrellas} />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
