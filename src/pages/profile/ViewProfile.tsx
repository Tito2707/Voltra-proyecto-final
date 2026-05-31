import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Post from "../../components/Post";
import ProfileBanner from "../../components/ProfileBanner";
import {
  getProfileByUsername,
  getPostsByUserId,
  getPostsByUsuario,
} from "../../services/ProfileService";
import type { Profile } from "../../types/Profile";
import type { GameData } from "../../types/Game";

export default function ViewProfile() {
  const { username } = useParams<{ username: string }>();
  const displayUsername = username ? decodeURIComponent(username) : "";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!displayUsername) {
      setPostsLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setPostsLoading(true);
      const p = await getProfileByUsername(displayUsername);
      if (!active) return;

      setProfile(p);

      if (p) {
        const posts = await getPostsByUserId(p.id);
        if (!active) return;
        setGames(posts);
      } else {
        const legacyPosts = await getPostsByUsuario(displayUsername);
        if (!active) return;
        setGames(legacyPosts);
      }

      setPostsLoading(false);
    };

    void load();

    return () => {
      active = false;
    };
  }, [displayUsername]);

  if (!displayUsername) {
    return (
      <div className="page-container py-8 text-voltra-text">
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
    <div id="profile-page" className="min-h-screen bg-voltra-bg">
      <ProfileBanner
        avatarSrc={avatarSrc}
        name={title}
        bio={profile?.bio}
        editMode="none"
      />

      <div className="page-container profile-posts-section">
        <div className="profile-posts-header">
          <h2>Posts</h2>
          <Link to="/feed" className="text-voltra-accent text-sm hover:underline no-underline">
            ← Volver al feed
          </Link>
        </div>

        {postsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-voltra-accent" />
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-voltra-text/70">Este usuario aún no tiene publicaciones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {games.map((game) => (
              <Post key={String(game.id)} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
