import { useEffect, useState } from "react";

import {
  Menu,
  X,
  Home,
  Bookmark,
  User,
  LogOut,
  Search,
} from "lucide-react";

import { supabase } from "../../services/supabase";

import "./Navbar.css";

interface Game {
  id: string;
  title: string;
}

export default function Navbar() {

  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [games, setGames] =
    useState<Game[]>([]);



  useEffect(() => {

    async function searchGames() {

      if (
        search.trim().length < 2
      ) {

        setGames([]);

        return;

      }

      const {
        data,
        error,
      } =

        await supabase

          .from("games")

          .select(
            "id,title"
          )

          .ilike(
            "title",
            `${search}%`
          )

          .limit(5);

      console.log(
        "RESULTADOS:",
        data
      );

      console.log(
        "ERROR:",
        error
      );

      setGames(
        data || []
      );

    }

    searchGames();

  }, [search]);



  const renderResults = () => {

    if (
      games.length === 0
    )
      return null;

    return (

      <div
        className="search-results"
      >

        {

          games.map(
            (
              game
            ) => (

              <div

                key={
                  game.id
                }

                className="game-item"

              >

                <span>

                  {
                    game.title
                  }

                </span>

              </div>

            )
          )

        }

      </div>

    );

  };



  return (
    <>
      <header className="navbar">

        <div className="navbar-content">

          <button
            className="menu-button"

            onClick={() =>
              setOpen(
                true
              )
            }
          >

            <Menu size={30} />

          </button>

          <h1 className="logo">

            VOLTRA

          </h1>

          <nav className="desktop-nav">

            <a>Home</a>

            <a>Favorites</a>

            <a>Log out</a>

          </nav>

          <div
            className="desktop-search"
          >

            <input

              value={
                search
              }

              onChange={(e)=>
                setSearch(
                  e.target.value
                )
              }

              placeholder="Search"

            />

            <Search size={18}/>

            {
              renderResults()
            }

          </div>

          <img
            src="https://i.pravatar.cc/100"
            className="avatar"
          />

        </div>



        <div
          className="mobile-search"
        >

          <input

            value={
              search
            }

            onChange={(e)=>
              setSearch(
                e.target.value
              )
            }

            placeholder="Search"

          />

          {
            renderResults()
          }

        </div>

      </header>



      <aside
        className={`sidebar ${
          open
            ? "open"
            : ""
        }`}
      >

        <div
          className="sidebar-top"
        >

          <h2>

            Menu

          </h2>

          <button
            onClick={() =>
              setOpen(
                false
              )
            }
          >

            <X size={28}/>

          </button>

        </div>

        <nav>

          <a>
            <Home/>
            Home
          </a>

          <a>
            <Bookmark/>
            Favorites
          </a>

          <a>
            <User/>
            Profile
          </a>

          <a>
            <LogOut/>
            Log out
          </a>

        </nav>

      </aside>

    </>
  );

}