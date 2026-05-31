import { useState, useEffect } from "react";
import { getReviews } from "../../services/ReviewService";
import type { GameData } from "../../types/Game";

const Favorites = () => {
  const [favoriteGames, setFavoriteGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favoriteIds: number[] = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );

        const allGames = await getReviews();

        const favorites = allGames.filter(
          (_: GameData, index: number) => favoriteIds.includes(index)
        );

        setFavoriteGames(favorites);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar favoritos:", error);
        setLoading(false);
      }
    };

    loadFavorites();

    const handleFocus = () => {
      loadFavorites();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const removeFromFavorites = async (
    gameIndex: number,
    gameName: string
  ) => {
    console.log(`Eliminando favorito: ${gameName} (ID: ${gameIndex})`);

    const favoriteIds: number[] = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    const updatedFavorites = favoriteIds.filter(
      (id: number) => id !== gameIndex
    );

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    const allGames = await getReviews();

    const favorites = allGames.filter(
      (_: GameData, index: number) => updatedFavorites.includes(index)
    );

    setFavoriteGames(favorites);
  };

  const getGameId = async (gameName: string): Promise<number> => {
    const allGames = await getReviews();

    return allGames.findIndex(
      (g: GameData) => g.nombre === gameName
    );
  };

  return (
    <div className="min-h-screen bg-voltra-bg">
      <div
        className="relative overflow-hidden w-full"
        style={{
          marginTop: "-110px",
          paddingTop: "110px",
          height: "510px",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/data/banner-image.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-voltra-bg"></div>
        </div>

        <div className="md:hidden absolute bottom-8 left-6 z-10">
          <h2 className="text-voltra-accent text-4xl font-bold mb-1">
            Your personal
          </h2>

          <h3 className="text-voltra-text text-3xl font-normal">
            Collection
          </h3>
        </div>

        <div className="hidden md:block absolute bottom-12 left-12 z-10">
          <h2 className="text-voltra-accent text-6xl font-bold mb-2">
            Your personal
          </h2>

          <h3 className="text-voltra-text text-5xl font-normal">
            Collection
          </h3>
        </div>
      </div>

      <div className="page-container py-8 md:py-12">
        {loading ? (
          <div className="text-center text-voltra-text/60 py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent"></div>

              <p className="text-xl text-voltra-text">
                Loading your favorites...
              </p>
            </div>
          </div>
        ) : favoriteGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {favoriteGames.map((game, originalIndex) => (
              <div key={originalIndex} className="relative">
                <div className="bg-voltra-bg rounded-xl overflow-hidden shadow-lg w-full text-voltra-text border border-voltra-text/10 transition-transform transform hover:scale-105 flex flex-col">
                  <div className="absolute top-3 left-3 bg-voltra-accent text-voltra-bg px-3 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
                    <i className="bi bi-bookmark-fill"></i>
                    Favorite
                  </div>

                  <button
                    onClick={async () => {
                      const gameId = await getGameId(game.nombre);

                      removeFromFavorites(gameId, game.nombre);
                    }}
                    className="absolute top-3 right-3 bg-voltra-accent hover:bg-voltra-accent/90 text-voltra-bg p-3 rounded-full w-12 h-12 flex items-center justify-center z-10 transition-all duration-200 shadow-lg border-0 outline-none hover:scale-110"
                    aria-label="Remove from favorites"
                    title="Remove from favorites"
                    style={{
                      background: "#CEFF05",
                      border: "none",
                      outline: "none",
                      boxShadow:
                        "0 4px 12px rgba(206, 255, 5, 0.35)",
                    }}
                  >
                    <svg
                      className="w-50 h-50"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 6h18v2H3V6zm2 3h14l-1 14H6L5 9zm5-6h4v1H10V3z" />

                      <path d="M9 4h6v1H9V4zM7 8h10l-.9 12H7.9L7 8zm2 2v8h2v-8H9zm4 0v8h2v-8h-2z" />
                    </svg>
                  </button>

                  <img
                    src={game.imagen}
                    alt={game.nombre}
                    className="w-full h-44 sm:h-48 object-cover"
                  />

                  <div className="p-4 flex flex-col justify-between flex-1">
                    {game.reseñas && game.reseñas.length > 0 && (
                      <>
                        <div>
                          <div className="flex items-center mb-3">
                            <img
                              src={`https://i.pravatar.cc/100?u=${game.reseñas[0].usuario}`}
                              alt={game.reseñas[0].usuario}
                              className="w-10 h-10 rounded-full mr-3 border border-voltra-text/20"
                            />

                            <h2 className="font-bold text-base">
                              {game.reseñas[0].usuario}
                            </h2>
                          </div>

                          <p className="text-voltra-text/80 text-sm text-left leading-relaxed mb-4 line-clamp-3">
                            {game.reseñas[0].reseña}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <i
                              className="bx bx-heart text-voltra-text/50"
                              style={{ fontSize: "20px" }}
                            ></i>

                            <span className="text-sm text-voltra-text/90">
                              {game.likes}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <i
                              className="bx bx-message-rounded text-voltra-text/50"
                              style={{ fontSize: "20px" }}
                            ></i>
                          </div>

                          <div className="flex items-center gap-2">
                            <i
                              className="bx bx-bookmark text-voltra-text/50"
                              style={{ fontSize: "20px" }}
                            ></i>
                          </div>

                          <div className="flex gap-1 ml-auto">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={
                                  star <= game.ranking_estrellas
                                    ? "#CEFF05"
                                    : "rgba(247, 248, 252, 0.25)"
                                }
                                width="18"
                                height="18"
                              >
                                <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l7.1-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-voltra-text/60 py-20">
            <div className="flex flex-col items-center gap-4">
              <i className="bi bi-bookmark text-6xl text-voltra-text/40"></i>

              <p className="text-2xl font-bold text-voltra-text">
                Your collection is empty
              </p>

              <p className="text-lg text-voltra-text/80">
                Start adding your favorite games from the Feed!
              </p>

              <a
                href="/feed"
                className="mt-4 bg-voltra-accent hover:bg-voltra-accent/90 text-voltra-bg px-8 py-3 rounded-lg transition-colors no-underline inline-block font-medium"
              >
                Browse Games
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
