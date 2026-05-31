import { Link } from "react-router-dom";
import type { GameData } from "../types/Game";
import PostInteraction from "./PostInteraction";

export default function Post({ game }: { game: GameData }) {
  const review = game.reseñas?.[0];
  const author = review?.usuario || "Usuario";
  const text = review?.reseña || game.nombre || "Sin descripción";
  const profilePath = author ? `/profile/${encodeURIComponent(author)}` : "#";

  return (
    <article className="post-card">
      <img
        src={game.imagen || "/minecraft.jpg"}
        alt={game.nombre}
        className="w-full h-40 sm:h-44 object-cover"
      />

      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 min-h-[140px]">
        <div>
          <div className="flex items-center mb-3">
            <Link
              to={profilePath}
              className="flex items-center no-underline text-inherit hover:opacity-90"
            >
              <img
                src={`https://i.pravatar.cc/100?u=${encodeURIComponent(author)}`}
                alt={author}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full mr-3 border border-voltra-text/20"
              />
              <h2 className="font-bold text-base sm:text-lg">{author}</h2>
            </Link>
          </div>

          <p className="text-voltra-text/75 text-sm text-left leading-relaxed line-clamp-4">
            {text}
          </p>
        </div>

        <div className="mt-4">
          <PostInteraction
            initialLikes={game.likes}
            ranking={game.ranking_estrellas}
            gameId={game.id}
          />
        </div>
      </div>
    </article>
  );
}
