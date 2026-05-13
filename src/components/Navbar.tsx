import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

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

          <div className="hidden md:flex absolute left-1/4 ml-[30px] transform -translate-x-1/2">
            <ul className="flex gap-8 items-center list-none m-0 p-0">
              <li>
                <Link
                  to="/feed"
                  className={`text-[18px] font-normal transition-colors font-poppins no-underline ${
                    isActive("/feed")
                      ? "text-voltra-accent"
                      : "text-voltra-text/60 hover:text-voltra-accent"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className={`text-[18px] font-normal transition-colors font-poppins no-underline ${
                    isActive("/favorites")
                      ? "text-voltra-accent"
                      : "text-voltra-text/60 hover:text-voltra-accent"
                  }`}
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  className={`text-[18px] font-normal transition-colors font-poppins no-underline ${
                    isActive("/logout")
                      ? "text-voltra-accent"
                      : "text-voltra-text/60 hover:text-voltra-accent"
                  }`}
                >
                  Log out
                </Link>
              </li>
            </ul>
          </div>

          <Link to="/profile" className="no-underline hidden md:block" onClick={closeMenu}>
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User Profile"
              className="w-[60px] h-[60px] rounded-full border-2 border-voltra-accent hover:border-voltra-accent/80 transition-colors cursor-pointer"
            />
          </Link>

          <Link to="/profile" className="no-underline md:hidden" onClick={closeMenu}>
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User Profile"
              className="w-[50px] h-[50px] rounded-full border-2 border-voltra-accent"
            />
          </Link>
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
            className="self-start text-voltra-text text- mb-8 rounded-full w-12 h-12 justify-center flex items-center border border-voltra-text/20"
            aria-label="Close menu"
          >
            <i className="fa fa-bars"></i>
          </button>

          <h3 className="self-start text-voltra-text text-xl font-bold mb-8 font-poppins">Menu</h3>

          <nav className="flex flex-col gap-6">
            <Link
              to="/feed"
              onClick={closeMenu}
              className={`flex items-center gap-3 text-lg font-normal transition-colors font-poppins no-underline ${
                isActive("/feed") ? "text-voltra-accent" : "text-voltra-text/60 hover:text-voltra-accent"
              }`}
            >
              <span className="text-xl">
                <i className="bi bi-house"></i>
              </span> Home
            </Link>

            <Link
              to="/favorites"
              onClick={closeMenu}
              className={`flex items-center gap-3 text-lg font-normal transition-colors font-poppins no-underline ${
                isActive("/favorites") ? "text-voltra-accent" : "text-voltra-text/60 hover:text-voltra-accent"
              }`}
            >
              <span className="text-xl">
                <i className="bi bi-star"></i>
              </span> Favorites
            </Link>

            <Link
              to="/profile"
              onClick={closeMenu}
              className={`flex items-center gap-3 text-lg font-normal transition-colors font-poppins no-underline ${
                isActive("/profile") ? "text-voltra-accent" : "text-voltra-text/60 hover:text-voltra-accent"
              }`}
            >
              <span className="text-xl">
                <i className="bi bi-person"></i>
              </span> Profile
            </Link>

            <Link
              to="/logout"
              onClick={closeMenu}
              className={`flex items-center gap-3 text-lg font-normal transition-colors font-poppins no-underline ${
                isActive("/logout") ? "text-voltra-accent" : "text-voltra-text/60 hover:text-voltra-accent"
              }`}
            >
              <span className="text-xl">
                <i className="bi bi-box-arrow-right"></i>
              </span> Log out
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
