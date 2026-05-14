import { Link } from "react-router-dom";
import type { GameData } from "../types/Game";
import PostInteraction from "./PostInteraction";

export default function Post({ game }: { game: GameData }) {
  return (
    <div
      key={game.id}
      className="bg-voltra-bg rounded-xl overflow-hidden shadow-lg max-w-sm w-full min-w-0 text-voltra-text border border-voltra-text/10 transition-transform transform hover:scale-[1.02] flex flex-col"
    >
      <img
        src={game.imagen}
        alt={game.nombre}
        className="w-full h-40 sm:h-44 object-cover"
      />

      <div className="flex flex-col justify-between flex-1 min-w-0 px-5 sm:px-6 pt-6 pb-6">
        {game.reseñas && game.reseñas.length > 0 && (
          <>
            <div className="min-w-0">
              <Link
                to={`/profile/${encodeURIComponent(game.reseñas[0].usuario)}`}
                className="flex items-center mb-4 no-underline text-inherit rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-voltra-accent focus-visible:ring-offset-2 focus-visible:ring-offset-voltra-bg"
              >
                <img
                  src={`https://i.pravatar.cc/100?u=${game.reseñas[0].usuario}`}
                  alt={game.reseñas[0].usuario}
                  className="w-10 h-10 rounded-full mr-3 border border-voltra-text/20"
                />
                <h2 className="font-bold text-lg">{game.reseñas[0].usuario}</h2>
              </Link>

              <p className="text-voltra-text/80 text-sm text-left leading-relaxed break-words">
                {game.reseñas[0].reseña}
              </p>
            </div>

            <div className="mt-6">
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
