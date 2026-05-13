import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-voltra-bg border-b border-voltra-border-soft z-50 h-[72px] flex items-center justify-between px-6 md:px-10">
      <Link to="/auth/feed" className="no-underline">
        <span
          className="text-voltra-accent font-bold tracking-wide text-2xl md:text-4xl"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          VOLTRA
        </span>
      </Link>
      <ul className="hidden md:flex gap-8 list-none m-0 p-0 items-center">
        <li>
          <Link
            to="/auth/feed"
            className={`font-poppins no-underline transition-colors ${isActive("/auth/feed") ? "text-voltra-accent" : "text-voltra-muted hover:text-voltra-text"}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/auth/favorites"
            className={`font-poppins no-underline transition-colors ${isActive("/auth/favorites") ? "text-voltra-accent" : "text-voltra-muted hover:text-voltra-text"}`}
          >
            Favorites
          </Link>
        </li>
        <li>
          <Link to="/auth/profile" className="no-underline">
            <img
              src="https://i.pravatar.cc/72?img=12"
              alt=""
              className="w-11 h-11 rounded-full border-2 border-voltra-accent"
            />
          </Link>
        </li>
        <li>
          <Link
            to="/auth/logout"
            className={`font-poppins no-underline text-voltra-muted hover:text-voltra-text`}
          >
            Log out
          </Link>
        </li>
      </ul>
      <Link to="/auth/profile" className="md:hidden no-underline">
        <img src="https://i.pravatar.cc/48?img=12" alt="" className="w-10 h-10 rounded-full border-2 border-voltra-accent" />
      </Link>
    </nav>
  );
}
