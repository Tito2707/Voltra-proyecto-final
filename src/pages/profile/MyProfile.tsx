import { useEffect, useState } from "react";
import Post from "../../components/Post";
import ProfileBanner from "../../components/ProfileBanner";
import { getSessionUserId } from "../../services/AuthService";
import { getProfileById, getPostsByUserId } from "../../services/ProfileService";
import type { Profile } from "../../types/Profile";
import type { GameData } from "../../types/Game";

export default function MyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const userId = await getSessionUserId();
      if (!active) return;

      if (!userId) {
        setProfileLoading(false);
        setPostsLoading(false);
        return;
      }

      const p = await getProfileById(userId);
      if (!active) return;

      setProfile(p);
      setProfileLoading(false);

      const posts = await getPostsByUserId(userId);
      if (!active) return;

      setGames(posts);
      setPostsLoading(false);
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (profileLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container py-8 text-voltra-text">
        <p>No se pudo cargar tu perfil.</p>
      </div>
    );
  }

  const avatarSrc =
    profile.avatar_url ||
    `https://i.pravatar.cc/120?u=${encodeURIComponent(profile.username)}`;
  const displayName = profile.full_name || profile.username;

  return (
    <div id="profile-page" className="min-h-screen bg-voltra-bg">
      <ProfileBanner
        avatarSrc={avatarSrc}
        name={displayName}
        bio={profile.bio}
        editMode="edit"
        editLink="/edit-profile"
      />

      <div className="page-container profile-posts-section">
        <div className="profile-posts-header">
          <h2>Posts</h2>
          <button type="button" className="profile-add-btn" aria-label="Crear post">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {postsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-voltra-accent" />
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <i className="bi bi-chat-square-text text-5xl text-voltra-text/30 mb-4" />
            <p className="text-voltra-text text-xl font-bold mb-2">Aún no tienes publicaciones</p>
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
