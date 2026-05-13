import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Post from "../../components/Post";
import Navbar from "../../components/Navbar";
import { mergeUserWithStored, readStoredProfile } from "../../services/UserProfileStorage";

interface Review {
  usuario: string;
  reseña: string;
}

interface Game {
  id: number;
  nombre: string;
  imagen: string;
  likes: number;
  ranking_estrellas: number;
  reseñas: Review[];
}

interface User {
  id: number;
  nombre: string;
  avatar: string;
  banner: string;
  bio: string;
  followers: number;
  following: number;
  email?: string;
  reviewUsuario?: string;
}

const Profile = () => {
  const DEFAULT_USER = "CraftyCat";
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [usersRes, gamesRes] = await Promise.all([fetch("/data/users.json"), fetch("/data/games.json")]);
        const usersData = await usersRes.json();
        const gamesData = await gamesRes.json();

        if (cancelled) return;

        setGames(gamesData);

        const defaultUser = usersData.find((u: User) => u.nombre === DEFAULT_USER) || usersData[0];
        setCurrentUser(mergeUserWithStored(defaultUser, readStoredProfile()) as User);
      } catch (e) {
        console.error("Error cargando datos:", e);
      }
    };

    void loadData();

    const onProfileUpdated = () => {
      void loadData();
    };
    window.addEventListener("voltra-profile-updated", onProfileUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("voltra-profile-updated", onProfileUpdated);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const reviewer = currentUser.reviewUsuario ?? currentUser.nombre;
    const filtered = games.filter((g) => g.reseñas.some((r) => r.usuario === reviewer));
    setUserGames(filtered);
    setLoading(false);
  }, [currentUser, games]);

  if (!currentUser) {
    return (
      <div className="w-screen h-screen bg-voltra-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-voltra-bg"
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      <Navbar />

      <div
        className="relative w-full"
        style={{
          height: "500px",
          marginTop: "-110px",
          paddingTop: "110px",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('${currentUser.banner}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-voltra-bg"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 z-10">
          <div className="relative mb-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.nombre}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-voltra-accent shadow-2xl object-cover"
            />
            <Link
              to="/edit-profile"
              className="absolute bottom-0 right-0 bg-voltra-bg hover:bg-voltra-text/10 text-voltra-accent border border-voltra-accent p-2 rounded-full shadow-lg transition w-10 h-10 flex items-center justify-center hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Link>
          </div>

          <h1 className="text-voltra-text text-3xl md:text-4xl font-bold mb-2 text-center">{currentUser.nombre}</h1>
          {currentUser.email ? (
            <p className="text-voltra-text/70 text-center text-sm mb-1">{currentUser.email}</p>
          ) : null}
          <p className="text-voltra-text/80 text-center px-4 text-sm md:text-base max-w-md">{currentUser.bio}</p>
        </div>
      </div>

      <div className="bg-voltra-bg w-full py-8 border-t border-voltra-text/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-voltra-text text-2xl md:text-3xl font-bold">Posts</h2>
            <button className="bg-voltra-accent hover:bg-voltra-accent/90 text-voltra-bg p-3 rounded-full shadow-lg w-12 h-12 flex items-center justify-center transition hover:scale-110 border border-voltra-accent">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent"></div>
            </div>
          ) : userGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGames.map((game) => (
                <Post key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <i className="bi bi-chat-square-text text-6xl text-voltra-text/40 mb-4"></i>
              <p className="text-voltra-text text-2xl font-bold mb-2">No posts yet</p>
              <p className="text-voltra-text/60 mb-6">Start sharing your gaming experiences!</p>
              <button className="bg-voltra-accent hover:bg-voltra-accent/90 text-voltra-bg px-8 py-3 rounded-lg transition-colors font-medium">
                Create Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
