import { useEffect, useState } from "react";
import { getReviews } from "../../services/ReviewService";
import type { GameData } from "../../types/Game";
import Post from "../../components/Post";

export default function Feed() {
  const [games, setGames] = useState<GameData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReviews();
        setGames(data);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div id="feed-page" className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-voltra-accent font-bold">Explore!</h1>
      <p className="text-voltra-text">Connect with the community</p>
      <div id="posts-container" className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {games.map((game: GameData) => {
          return <Post key={game.id} game={game} />;
        })}
      </div>
    </div>
  );
}
