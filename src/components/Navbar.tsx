import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getSessionUserId, onAuthStateChange } from "../services/AuthService";
import { getProfileAvatar } from "../services/ProfileService";
import { searchGames } from "../services/GameService";
import { useSearch } from "../context/SearchContext";

const avatarCache = new Map<string, string>();

async function loadAvatar(userId: string): Promise<string> {
  const cached = avatarCache.get(userId);

  if (cached) return cached;

  const url = await getProfileAvatar(userId);

  avatarCache.set(userId, url);

  return url;
}

export default function Navbar() {
  const location = useLocation();

  const { searchTerm, setSearchTerm } = useSearch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [authenticated, setAuthenticated] =
    useState(false);

  const [avatarUrl, setAvatarUrl] =
    useState<string | null>(null);

  const [suggestions, setSuggestions] =
    useState<any[]>([]);

  const [loadingSearch, setLoadingSearch] =
    useState(false);

  useEffect(() => {
    let active = true;

    const syncAuth = async (
      userId: string | null
    ) => {
      setAuthenticated(!!userId);

      if (!userId) {
        setAvatarUrl(null);
        return;
      }

      const url =
        await loadAvatar(userId);

      if (active) {
        setAvatarUrl(url);
      }
    };

    const { data: sub } =
      onAuthStateChange(
        async (_event, session) => {
          await syncAuth(
            session?.user.id ??
              null
          );
        }
      );

    void getSessionUserId().then(
      (userId) =>
        syncAuth(userId)
    );

    return () => {
      active = false;

      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchGames =
      async () => {
        if (
          searchTerm.length < 2
        ) {
          setSuggestions([]);
          return;
        }

        setLoadingSearch(true);

        const results =
          await searchGames(
            searchTerm
          );

        setSuggestions(results);

        setLoadingSearch(false);
      };

    const timer =
      setTimeout(
        fetchGames,
        250
      );

    return () =>
      clearTimeout(timer);
  }, [searchTerm]);

  const isActive = (
    path: string
  ) =>
    location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-voltra-bg shadow-md z-50 h-[110px]">

        <div className="page-container flex justify-between items-center h-full">

          <Link to="/feed">
            <h2
              className="text-voltra-accent text-5xl"
              style={{
                fontFamily:
                  "Blatant",
              }}
            >
              VOLTRA
            </h2>
          </Link>

          <div className="hidden md:flex gap-8">

            <Link
              to="/feed"
              className={
                isActive("/feed")
                  ? "text-voltra-accent"
                  : ""
              }
            >
              Home
            </Link>

            <Link to="/favorites">
              Favorites
            </Link>

            {authenticated ? (
              <>
                <Link to="/profile">
                  Profile
                </Link>

                <Link to="/logout">
                  Logout
                </Link>
              </>
            ) : (
              <Link to="/login">
                Login
              </Link>
            )}

          </div>

          <div className="relative hidden md:flex items-center gap-4">

            <div className="nav-search relative">

              <input
                type="text"
                placeholder="Search game..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

              {(loadingSearch ||
                suggestions.length >
                  0) && (

                <div
                  className="
                    absolute
                    top-[58px]
                    left-0
                    w-full
                    rounded-xl
                    bg-[#1C1C1C]
                    overflow-hidden
                    border
                    border-white/10
                    shadow-lg
                  "
                >

                  {loadingSearch && (
                    <div className="px-4 py-3 text-white/60">
                      Buscando...
                    </div>
                  )}

                  {suggestions.map(
                    (
                      game
                    ) => (

                      <div
                        key={
                          game.id
                        }
                        className="
                          px-4
                          py-3
                          hover:bg-white/5
                          cursor-pointer
                          transition-colors
                          border-b
                          border-white/5
                          last:border-none
                        "
                      >

                        <span
                          className="
                            text-white
                            text-[16px]
                          "
                        >
                          {game.title}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {authenticated &&
              avatarUrl && (
                <Link to="/profile">

                  <img
                    src={
                      avatarUrl
                    }
                    className="nav-avatar"
                    alt="Mi perfil"
                  />

                </Link>
              )}

          </div>

        </div>

      </nav>
    </>
  );
}