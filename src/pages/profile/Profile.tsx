import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getReviews } from "../../services/ReviewService";
import type { GameData } from "../../types/Game";
import Post from "../../components/Post";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const displayName = username ? decodeURIComponent(username) : "";
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!displayName) {
      setGames([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const all = await getReviews();
        setGames(
          all.filter((g) =>
            Boolean(g.reseñas?.some((r) => r.usuario === displayName))
          )
        );
      } catch (e) {
        console.error("Error loading profile:", e);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [displayName]);

  if (!displayName) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-voltra-text">
        <p>Invalid profile.</p>
        <Link to="/feed" className="text-voltra-accent mt-2 inline-block">
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div id="profile-page" className="max-w-7xl mx-auto px-4 py-10 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12 sm:mb-14">
        <img
          src={`https://i.pravatar.cc/120?u=${encodeURIComponent(displayName)}`}
          alt={displayName}
          className="w-24 h-24 shrink-0 rounded-full border-2 border-voltra-accent/40"
        />
        <div className="min-w-0 space-y-2">
          <h1 className="text-voltra-accent font-bold text-2xl sm:text-3xl">
            {displayName}
          </h1>
          <p className="text-voltra-text/80">
            {loading
              ? "Loading posts…"
              : `${games.length} post${games.length === 1 ? "" : "s"}`}
          </p>
          <Link
            to="/feed"
            className="text-voltra-accent text-sm mt-1 inline-block hover:underline"
          >
            ← Back to feed
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-voltra-text/70">Loading…</p>
      ) : games.length === 0 ? (
        <p className="text-voltra-text/70">This user has no posts on VOLTRA yet.</p>
      ) : (
        <div
          id="profile-posts"
          className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12"
        >
          {games.map((game) => (
            <Post key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
