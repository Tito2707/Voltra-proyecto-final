import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Post from "../../components/Post";
import { getSessionUserId } from "../../services/AuthService";
import { getMyProfileData } from "../../services/ProfileService";
import type { Profile } from "../../types/Profile";
import type { GameData } from "../../types/Game";

export default function MyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [postCount, setPostCount] = useState(0);
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const userId = await getSessionUserId();
      if (!active) return;

      if (!userId) {
        setLoading(false);
        return;
      }

      const data = await getMyProfileData(userId);
      if (!active) return;

      setProfile(data.profile);
      setPostCount(data.postCount);
      setGames(data.games);
      setLoading(false);
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-voltra-text">
        <p>No se pudo cargar tu perfil.</p>
      </div>
    );
  }

  const avatarSrc =
    profile.avatar_url ||
    `https://i.pravatar.cc/120?u=${encodeURIComponent(profile.username)}`;
  const memberSince = new Date(profile.created_at).toLocaleDateString();

  return (
    <div id="profile-page" className="max-w-7xl mx-auto px-4 py-10 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-12 sm:mb-14">
        <img
          src={avatarSrc}
          alt={profile.username}
          className="w-28 h-28 shrink-0 rounded-full border-2 border-voltra-accent/40 object-cover"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-voltra-accent font-bold text-2xl sm:text-3xl">
              {profile.full_name || profile.username}
            </h1>
            <Link
              to="/edit-profile"
              className="text-voltra-accent border border-voltra-accent/60 px-3 py-1 rounded-full text-sm hover:bg-voltra-accent/10 no-underline"
            >
              Editar perfil
            </Link>
          </div>
          <p className="text-voltra-text/80">@{profile.username}</p>
          {profile.bio && <p className="text-voltra-text/90 max-w-xl">{profile.bio}</p>}
          <p className="text-voltra-text/60 text-sm">Miembro desde {memberSince}</p>
          <p className="text-voltra-text/80">
            {postCount} post{postCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {games.length === 0 ? (
        <p className="text-voltra-text/70">Aún no tienes publicaciones.</p>
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
