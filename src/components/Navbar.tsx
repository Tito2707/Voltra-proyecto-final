import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSessionUserId, onAuthStateChange } from "../services/AuthService";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const { data: sub } = onAuthStateChange(async (_event, session) => {
      setAuthenticated(!!session);
    });
    void getSessionUserId().then((userId) => {
      setAuthenticated(!!userId);
    });
    return () => sub.subscription.unsubscribe();
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
      <nav className="fixed top-0 left-0 w-full bg-voltra-bg shadow-md z-50 h-[110px]">
        <div className="flex justify-between items-center px-10 h-full">
          <button
            onClick={toggleMenu}
            className="md:hidden z-50 text-voltra-text bg-voltra-bg rounded-full w-12 h-12 flex items-center justify-center border border-voltra-text/20 hover:border-voltra-accent/50 transition-colors"
            aria-label="Toggle menu"
          >
            <i className="fa fa-bars"></i>
          </button>

          <Link to="/feed" className="no-underline" onClick={closeMenu}>
            <h2
              className="text-voltra-accent font-bold tracking-wide text-3xl md:text-5xl md:ml-15"
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
                      Logout
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

          <div className="hidden md:block w-[60px]" />
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
                  Logout
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
