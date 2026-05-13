import { useState, useEffect } from "react";
import { getReviews } from "../services/ReviewService";
import PostInteraction from "./PostInteraction";

interface Review {
  usuario: string;
  reseña: string;
}

interface GameData {
  id: number;
  nombre: string;
  imagen: string;
  likes: number;
  ranking_estrellas: number;
  reseñas: Review[];
}

interface SearchBarInputProps {
  onSearch: (searchTerm: string) => void;
  showIcon?: boolean;
}

function SearchBarInput({ onSearch, showIcon = true }: SearchBarInputProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
        style={{
          width: "100%",
          height: "40px",
          padding: showIcon ? "0 40px 0 16px" : "0 16px",
          backgroundColor: "#1C1C1C",
          color: "#F7F8FC",
          border: "1px solid rgba(247, 248, 252, 0.15)",
          borderRadius: "9999px",
          fontSize: "14px",
          outline: "none",
        }}
      />
      {showIcon && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "18px", height: "18px", color: "rgba(247, 248, 252, 0.45)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function PostCard({ game }: { game: GameData }) {
  return (
    <div
      style={{
        backgroundColor: "#1C1C1C",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.25)",
        maxWidth: "384px",
        width: "100%",
        color: "#F7F8FC",
        border: "1px solid rgba(247, 248, 252, 0.1)",
        transition: "transform 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <img
        src={game.imagen}
        alt={game.nombre}
        style={{
          width: "100%",
          height: "192px",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        {game.reseñas && game.reseñas.length > 0 && (
          <>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <img
                  src={`https://i.pravatar.cc/100?u=${game.reseñas[0].usuario}`}
                  alt={game.reseñas[0].usuario}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "12px",
                    border: "1px solid rgba(247, 248, 252, 0.2)",
                  }}
                />
                <h2
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {game.reseñas[0].usuario}
                </h2>
              </div>
              <p
                style={{
                  color: "rgba(247, 248, 252, 0.8)",
                  fontSize: "14px",
                  textAlign: "left",
                  lineHeight: "1.6",
                }}
              >
                {game.reseñas[0].reseña}
              </p>
            </div>

            <div style={{ marginTop: "16px" }}>
              <PostInteraction initialLikes={game.likes} ranking={game.ranking_estrellas} gameId={game.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SearchBar() {
  const [games, setGames] = useState<GameData[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReviews();
        setGames(data);
        setFilteredGames(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredGames(games);
      return;
    }

    const searchLower = term.toLowerCase();
    const filtered = games.filter((game) => {
      const matchName = game.nombre.toLowerCase().includes(searchLower);

      const matchUser = game.reseñas.some((review) => review.usuario.toLowerCase().includes(searchLower));

      return matchName || matchUser;
    });

    setFilteredGames(filtered);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#1C1C1C",
          borderBottom: "1px solid rgba(247, 248, 252, 0.1)",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "60px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
          className="hidden-mobile"
        >
          <SearchBarInput onSearch={handleSearch} />
        </div>

        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="show-mobile"
        >
          <SearchBarInput onSearch={handleSearch} showIcon={false} />
        </div>
      </div>

      <div
        style={{
          marginTop: "60px",
          minHeight: "calc(100vh - 60px)",
          backgroundColor: "#1C1C1C",
          padding: "24px",
        }}
        className="content-desktop"
      >
        {searchTerm && (
          <p style={{ color: "rgba(247, 248, 252, 0.55)", marginBottom: "24px", fontSize: "14px" }}>
            Resultados para: <span style={{ color: "#F7F8FC", fontWeight: "600" }}>"{searchTerm}"</span>
            {" - "}
            <span style={{ color: "#CEFF05" }}>{filteredGames.length} juegos encontrados</span>
          </p>
        )}

        {loading ? (
          <p style={{ color: "rgba(247, 248, 252, 0.8)", marginTop: "20px" }}>Cargando juegos...</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            {filteredGames.length > 0 ? (
              filteredGames.map((game, index) => <PostCard key={index} game={game} />)
            ) : (
              <p
                style={{
                  color: "rgba(247, 248, 252, 0.55)",
                  textAlign: "center",
                  padding: "40px",
                  width: "100%",
                }}
              >
                No se encontraron juegos que coincidan con "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "64px",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#1C1C1C",
          padding: "20px 16px",
        }}
        className="content-mobile"
      >
        {searchTerm && (
          <p style={{ color: "rgba(247, 248, 252, 0.55)", marginBottom: "16px", fontSize: "13px" }}>
            Buscando: <span style={{ color: "#F7F8FC", fontWeight: "600" }}>"{searchTerm}"</span>
            {" - "}
            <span style={{ color: "#CEFF05" }}>{filteredGames.length} encontrados</span>
          </p>
        )}

        {loading ? (
          <p style={{ color: "rgba(247, 248, 252, 0.8)", marginTop: "20px" }}>Cargando juegos...</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "16px",
              alignItems: "center",
            }}
          >
            {filteredGames.length > 0 ? (
              filteredGames.map((game, index) => <PostCard key={index} game={game} />)
            ) : (
              <p
                style={{
                  color: "rgba(247, 248, 252, 0.55)",
                  textAlign: "center",
                  padding: "40px 20px",
                }}
              >
                No se encontraron juegos que coincidan con "{searchTerm}"
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
          .content-mobile { display: none !important; }
          .content-desktop { display: block !important; }
        }

        @media (max-width: 767px) {
          .show-mobile { display: flex !important; }
          .hidden-mobile { display: none !important; }
          .content-mobile { display: block !important; }
          .content-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default SearchBar;
