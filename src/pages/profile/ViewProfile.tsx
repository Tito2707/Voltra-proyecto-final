import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Post from "../../components/Post";
import {
  getProfileByUsername,
  getPostsByUserId,
  getPostsByUsuario,
  getPostCount,
} from "../../services/ProfileService";
import type { Profile } from "../../types/Profile";
import type { GameData } from "../../types/Game";

export default function ViewProfile() {
  const { username } = useParams<{ username: string }>();
  const displayUsername = username ? decodeURIComponent(username) : "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!displayUsername) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const p = await getProfileByUsername(displayUsername);
      setProfile(p);
      if (p) {
        const [posts, count] = await Promise.all([
          getPostsByUserId(p.id),
          getPostCount(p.id),
        ]);
        setGames(posts);
        setPostCount(count);
      } else {
        const legacyPosts = await getPostsByUsuario(displayUsername);
        setGames(legacyPosts);
        setPostCount(legacyPosts.length);
      }
      setLoading(false);
    };

    void load();
  }, [displayUsername]);

  if (!displayUsername) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-voltra-text">
        <p>Perfil no válido.</p>
        <Link to="/feed" className="text-voltra-accent mt-2 inline-block">
          Volver al feed
        </Link>
      </div>
    );
  }

  const avatarSrc = profile?.avatar_url
    ? profile.avatar_url
    : `https://i.pravatar.cc/120?u=${encodeURIComponent(displayUsername)}`;
  const title = profile?.full_name || profile?.username || displayUsername;

  return (
    <div id="profile-page" className="max-w-7xl mx-auto px-4 py-10 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12 sm:mb-14">
        <img
          src={avatarSrc}
          alt={title}
          className="w-24 h-24 shrink-0 rounded-full border-2 border-voltra-accent/40 object-cover"
        />
        <div className="min-w-0 space-y-2">
          <h1 className="text-voltra-accent font-bold text-2xl sm:text-3xl">{title}</h1>
          {profile && <p className="text-voltra-text/80">@{profile.username}</p>}
          {profile?.bio && <p className="text-voltra-text/90 max-w-xl">{profile.bio}</p>}
          <p className="text-voltra-text/80">
            {loading
              ? "Cargando posts…"
              : `${postCount} post${postCount === 1 ? "" : "s"}`}
          </p>
          <Link to="/feed" className="text-voltra-accent text-sm mt-1 inline-block hover:underline">
            ← Volver al feed
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-voltra-text/70">Cargando…</p>
      ) : games.length === 0 ? (
        <p className="text-voltra-text/70">Este usuario aún no tiene publicaciones.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {games.map((game) => (
            <Post key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
