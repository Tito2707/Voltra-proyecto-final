import { useEffect, useState } from "react";
import gamesData from "../data/games.json";

const Feed = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  return (
    <div className="feed-page">
      <h1>Explore!</h1>
      <p>Connect with the community</p>

      <div className="posts-container">
        {games.map((game: any) => {
          return (
            <div key={game.id} className="post-card">
              <h2>{game.title}</h2>
              <p>{game.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Feed;