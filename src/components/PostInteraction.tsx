import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import messageIcon from "../assets/message-icon.png";
import bookmark from "../assets/bookmark.png";
import bookmarkFill from "../assets/bookmark-fill.png";

interface PostInteractionProps {
  initialLikes: number;
  ranking: number;
  gameId: number;
}

export default function PostInteraction({ initialLikes, ranking, gameId }: PostInteractionProps) {
  const navigate = useNavigate();

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
    if (storedLikes[gameId]) {
      setLikes(storedLikes[gameId].count);
      setLiked(storedLikes[gameId].liked);
    }

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(storedFavorites.includes(gameId));
  }, [gameId]);

  const handleLike = () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    setLiked(newLiked);
    setLikes(newLikes);

    const storedLikes = JSON.parse(localStorage.getItem("likes") || "{}");
    storedLikes[gameId] = { count: newLikes, liked: newLiked };
    localStorage.setItem("likes", JSON.stringify(storedLikes));
  };

  const handleCommentClick = () => navigate(`/comments/${gameId}`);

  const handleFavoriteClick = () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = storedFavorites.filter((id: number) => id !== gameId);
    } else {
      updatedFavorites = [...storedFavorites, gameId];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex items-center gap-4 mt-3">
      <div className="flex items-center gap-2">
        <button
          onClick={handleLike}
          className="transition-all duration-200 flex items-center justify-center"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            boxShadow: "none",
            padding: 0,
            width: "24px",
            height: "24px",
          }}
          onFocus={(e) => e.currentTarget.blur()}
        >
          <i
            className={`bx ${
              liked ? "bxs-heart text-voltra-accent" : "bx-heart text-voltra-text/50"
            } transition-all duration-200`}
            style={{ fontSize: "22px", lineHeight: "1" }}
          ></i>
        </button>
        <span className="text-sm text-voltra-text/90">{likes}</span>
      </div>

      <div>
        <img
          onClick={handleCommentClick}
          src={messageIcon}
          alt="comentarios"
          className="w-6 h-6 cursor-pointer"
        />
      </div>

      <div>
        <img
          onClick={handleFavoriteClick}
          src={isFavorite ? bookmarkFill : bookmark}
          alt="favorito"
          className="w-6 h-6 cursor-pointer transition-all duration-200"
        />
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="mask mask-star w-5 h-5"
            style={{
              backgroundColor: star <= ranking ? "#CEFF05" : "rgba(247, 248, 252, 0.25)",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}
