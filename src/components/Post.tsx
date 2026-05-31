import { Link } from "react-router-dom";
import type { GameData } from "../types/Game";
import PostInteraction from "./PostInteraction";

export default function Post({ game }: { game: GameData }) {
  const author = game.reseñas?.[0]?.usuario ?? "";
  const profilePath = author ? `/profile/${encodeURIComponent(author)}` : "#";

  console.log("JUEGO:", game.nombre);
  console.log("IMAGEN:", game.imagen);

  return (
    <div
      key={game.id}
      className="bg-voltra-bg rounded-xl overflow-hidden shadow-lg max-w-sm w-full text-voltra-text border border-voltra-text/10 transition-transform transform hover:scale-105 flex flex-col"
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
                <Link
                  to={profilePath}
                  className="flex items-center no-underline text-inherit hover:opacity-90"
                >
                  <img
                    src={`https://i.pravatar.cc/100?u=${game.reseñas[0].usuario}`}
                    alt={game.reseñas[0].usuario}
                    className="w-10 h-10 rounded-full mr-3 border border-voltra-text/20"
                  />
                  <h2 className="font-bold text-lg">{game.reseñas[0].usuario}</h2>
                </Link>
              </div>

              <p className="text-voltra-text/80 text-sm text-left leading-relaxed">{game.reseñas[0].reseña}</p>
            </div>

            <div className="mt-4">
              <PostInteraction
                initialLikes={game.likes}
                ranking={game.ranking_estrellas}
                gameId={game.id}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
