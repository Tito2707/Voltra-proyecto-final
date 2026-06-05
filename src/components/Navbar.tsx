import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Menu,
  X,
} from "lucide-react";

import {
  getSessionUserId,
  onAuthStateChange,
} from "../services/AuthService";

import {
  getProfileAvatar,
} from "../services/ProfileService";

import {
  searchGames,
} from "../services/GameService";

import {
  useSearch,
} from "../context/SearchContext";

const avatarCache =
  new Map<string, string>();

async function loadAvatar(
  userId: string
): Promise<string> {
  const cached =
    avatarCache.get(userId);

  if (cached)
    return cached;

  const url =
    await getProfileAvatar(
      userId
    );

  avatarCache.set(
    userId,
    url
  );

  return url;
}

export default function Navbar() {

  const location =
    useLocation();

  const {
    searchTerm,
    setSearchTerm,
  } =
    useSearch();

  const showSearch =
    location.pathname ===
    "/feed";

  const [
    authenticated,
    setAuthenticated,
  ] =
    useState(false);

  const [
    avatarUrl,
    setAvatarUrl,
  ] =
    useState<
      string | null
    >(null);

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] =
    useState(false);

  const [
    suggestions,
    setSuggestions,
  ] =
    useState<any[]>([]);

  const [
    loadingSearch,
    setLoadingSearch,
  ] =
    useState(false);

  useEffect(() => {

    let active =
      true;

    async function sync(
      userId:
        | string
        | null
    ) {

      setAuthenticated(
        !!userId
      );

      if (
        !userId
      ) {

        setAvatarUrl(
          null
        );

        return;

      }

      const url =
        await loadAvatar(
          userId
        );

      if (
        active
      ) {

        setAvatarUrl(
          url
        );

      }

    }

    const {
      data,
    } =
      onAuthStateChange(
        async (
          _,
          session
        ) => {

          await sync(
            session
              ?.user
              .id ??
              null
          );

        }
      );

    getSessionUserId().then(
      sync
    );

    return () => {

      active =
        false;

      data.subscription.unsubscribe();

    };

  }, []);

  useEffect(() => {

    const timer =
      setTimeout(
        async () => {

          if (
            searchTerm.length <
            2
          ) {

            setSuggestions(
              []
            );

            return;

          }

          setLoadingSearch(
            true
          );

          const results =
            await searchGames(
              searchTerm
            );

          setSuggestions(
            results
          );

          setLoadingSearch(
            false
          );

        },
        250
      );

    return () =>
      clearTimeout(
        timer
      );

  }, [searchTerm]);

  const renderSuggestions =
    () => (
      <>
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
            z-50
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
                  "
                >

                  {game.title}

                </div>

              )
            )}

          </div>

        )}
      </>
    );

  return (
    <>

      <nav className="fixed top-0 left-0 w-full bg-voltra-bg shadow-md z-50 h-[110px]">

        {/* DESKTOP */}

        <div className="page-container hidden md:flex justify-between items-center h-full">

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

          <div className="flex gap-8">

            <Link to="/feed">
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

          <div className="hidden md:flex items-center gap-4">

            {showSearch && (

              <div className="relative nav-search">

                <input
                  value={
                    searchTerm
                  }
                  placeholder="Search game..."
                  onChange={(e)=>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

                {renderSuggestions()}

              </div>

            )}

            {authenticated &&
              avatarUrl && (

              <Link to="/profile">

                <img
                  src={
                    avatarUrl
                  }
                  className="nav-avatar"
                />

              </Link>

            )}

          </div>

        </div>

        {/* MOBILE */}

        <div className="md:hidden px-5 pt-5">

          <div className="flex justify-between items-center">

            <button
              onClick={() =>
                setIsMenuOpen(
                  true
                )
              }
              className="
                w-[58px]
                h-[58px]
                rounded-full
                bg-[#3E4552]
                flex
                items-center
                justify-center
              "
            >

              <Menu size={34}/>

            </button>

            {authenticated &&
              avatarUrl && (

              <Link to="/profile">

                <img
                  src={
                    avatarUrl
                  }
                  className="
                    w-[64px]
                    h-[64px]
                    rounded-full
                  "
                />

              </Link>

            )}

          </div>

          {showSearch && (

          <div className="flex justify-center mt-6">

            <div className="relative w-[86%]">

              <input
                value={
                  searchTerm
                }
                onChange={(e)=>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search"
                className="
                  w-full
                  h-[54px]
                  rounded-full
                  bg-[#3E4552]
                  px-7
                  outline-none
                "
              />

              {renderSuggestions()}

            </div>

          </div>

          )}

        </div>

      </nav>

      {/* MENU */}

      {isMenuOpen && (

      <div className="fixed inset-0 z-[999]">

        <div
          className="
            absolute
            inset-0
            bg-black/40
          "
          onClick={() =>
            setIsMenuOpen(
              false
            )
          }
        />

        <aside
          className="
            w-[300px]
            h-full
            bg-[#11131A]
            px-6
            pt-14
            relative
          "
        >

          <div className="flex justify-between">

            <h2 className="text-2xl font-bold">
              Menu
            </h2>

            <button
              onClick={() =>
                setIsMenuOpen(
                  false
                )
              }
            >

              <X size={32}/>

            </button>

          </div>

          <div className="mt-10 space-y-4">

            <Link to="/feed">
              <div className="py-5 border-b border-white/30">
                Home
              </div>
            </Link>

            <Link to="/favorites">
              <div className="py-5 border-b border-white/30">
                Favorites
              </div>
            </Link>

            <Link to="/profile">
              <div className="py-5 border-b border-white/30">
                Profile
              </div>
            </Link>

            <Link to="/logout">
              <div className="py-5 border-b border-white/30">
                Log out
              </div>
            </Link>

          </div>

        </aside>

      </div>

      )}

    </>
  );

}