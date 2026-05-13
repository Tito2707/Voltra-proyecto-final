import { useState } from "react";
import messageIcon from "../assets/message-icon.png";
import bookmarkFill from "../assets/bookmark-fill.png";

interface PostInteractionProps {
  initialLikes: number;
  ranking: number;
}

export default function PostInteraction({
  initialLikes,
  ranking,
}: PostInteractionProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const handleCommentClick = () => {
    window.location.href = "/comments";
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
              liked ? "bxs-heart text-voltra-accent" : "bx-heart text-voltra-muted"
            } transition-all duration-200`}
            style={{ fontSize: "22px", lineHeight: "1" }}
          ></i>
        </button>
        <span className="text-sm text-voltra-text">{likes}</span>
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
          src={bookmarkFill}
          alt="favorito"
          className="w-6 h-6 cursor-pointer"
        />
      </div>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="mask mask-star w-5 h-5"
            style={{
              backgroundColor:
                star <= ranking ? "var(--voltra-accent)" : "var(--voltra-star-empty)",
            }}
          ></span>
        ))}
      </div>
    </div>
  );
}
