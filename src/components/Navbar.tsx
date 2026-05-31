import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSessionUserId, onAuthStateChange } from "../services/AuthService";
import { getProfileAvatar } from "../services/ProfileService";
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
  const [authenticated, setAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const syncAuth = async (userId: string | null) => {
      setAuthenticated(!!userId);
      if (!userId) {
        setAvatarUrl(null);
        return;
      }
      const url = await loadAvatar(userId);
      if (active) setAvatarUrl(url);
    };

    const { data: sub } = onAuthStateChange(async (_event, session) => {
      await syncAuth(session?.user.id ?? null);
    });

    void getSessionUserId().then((userId) => syncAuth(userId));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClass = (path: string) =>
    `text-[18px] font-normal transition-colors font-poppins no-underline ${
      isActive(path) ? "text-voltra-accent" : "text-voltra-text/60 hover:text-voltra-accent"
    }`;

  const mobileLinkClass = (path: string) =>
    `flex items-center gap-3 text-lg font-normal transition-colors font-poppins no-underline ${
      isActive(path) ? "text-voltra-accent" : "text-voltra-text/60 hover:text-voltra-accent"
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-voltra-bg shadow-md z-50 h-[110px] border-b border-voltra-text/5">
        <div className="page-container flex justify-between items-center h-full gap-4">
          <button
            onClick={toggleMenu}
            className="md:hidden z-50 text-voltra-text bg-voltra-bg rounded-full w-12 h-12 flex items-center justify-center border border-voltra-text/20 hover:border-voltra-accent/50 transition-colors"
            aria-label="Toggle menu"
          >
            <i className="fa fa-bars"></i>
          </button>

          <Link to="/feed" className="no-underline shrink-0" onClick={closeMenu}>
            <h2
              className="text-voltra-accent font-bold tracking-wide text-3xl md:text-5xl"
              style={{ fontFamily: "Blatant, sans-serif" }}
            >
              VOLTRA
            </h2>
          </Link>

          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex gap-8 items-center list-none m-0 p-0">
              <li>
                <Link to="/feed" className={navLinkClass("/feed")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/favorites" className={navLinkClass("/favorites")}>
                  Favorites
                </Link>
              </li>
              {authenticated ? (
                <>
                  <li>
                    <Link to="/profile" className={navLinkClass("/profile")}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/logout" className={navLinkClass("/logout")}>
                      Log out
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className={navLinkClass("/login")}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div className="nav-search">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {authenticated && avatarUrl ? (
              <Link to="/profile" className="no-underline">
                <img src={avatarUrl} alt="Mi perfil" className="nav-avatar" />
              </Link>
            ) : (
              <div className="w-[2.75rem]" />
            )}
          </div>

          <div className="md:hidden w-12" />
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-voltra-bg/50 z-40 transition-opacity md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-voltra-bg border-r border-voltra-text/10 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 pt-8">
          <button
            onClick={closeMenu}
            className="self-start text-voltra-text mb-8 rounded-full w-12 h-12 justify-center flex items-center border border-voltra-text/20"
            aria-label="Close menu"
          >
            <i className="fa fa-bars"></i>
          </button>

          <h3 className="self-start text-voltra-text text-xl font-bold mb-8 font-poppins">Menu</h3>

          <div className="nav-search mb-6 max-w-none">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <nav className="flex flex-col gap-6">
            <Link to="/feed" onClick={closeMenu} className={mobileLinkClass("/feed")}>
              <span className="text-xl">
                <i className="bi bi-house"></i>
              </span>{" "}
              Home
            </Link>

            <Link to="/favorites" onClick={closeMenu} className={mobileLinkClass("/favorites")}>
              <span className="text-xl">
                <i className="bi bi-star"></i>
              </span>{" "}
              Favorites
            </Link>

            {authenticated ? (
              <>
                <Link to="/profile" onClick={closeMenu} className={mobileLinkClass("/profile")}>
                  <span className="text-xl">
                    <i className="bi bi-person"></i>
                  </span>{" "}
                  Profile
                </Link>
                <Link to="/logout" onClick={closeMenu} className={mobileLinkClass("/logout")}>
                  <span className="text-xl">
                    <i className="bi bi-box-arrow-right"></i>
                  </span>{" "}
                  Log out
                </Link>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className={mobileLinkClass("/login")}>
                <span className="text-xl">
                  <i className="bi bi-box-arrow-in-right"></i>
                </span>{" "}
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
