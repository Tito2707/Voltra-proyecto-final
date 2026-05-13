import { useState } from "react";

import "./Comments.css";

import {
  Heart,
  Bookmark,
  MessageCircle,
  Send,
} from "lucide-react";

import hero from "../../assets/hero.png";

const comments = [
  {
    id: 1,
    name: "Jorge Castaño",
    text: "Me encantó que volvieran algunas armas clásicas, me da nostalgia y al mismo tiempo el juego se siente renovado.",
  },
  {
    id: 2,
    name: "Mariana Pacheca",
    text: "El mapa nuevo tiene buenas ideas, pero también hay zonas que se sienten vacías y aburridas de explorar.",
  },
  {
    id: 3,
    name: "Laura Ortiz",
    text: "Me encanta el nuevo evento, la música estuvo épica.",
  },
  {
    id: 4,
    name: "Laura Ortiz",
    text: "La nueva skin está brutal 🔥 ¿ya la vieron?",
  },
];

function Comments() {
  const [liked, setLiked] = useState(false);

  const [saved, setSaved] = useState(false);

  const [rating, setRating] = useState(5);

  return (
    <div className="comments-page">
      <div className="comments-container">
        {/* LEFT */}

        <section className="post-section">
          <h1>Explore!</h1>

          <p>Connect with the community</p>

          <div className="post-card">
            <img
              src={hero}
              alt="post"
              className="post-image"
            />

            <div className="post-content">
              <div className="user-info">
                <img
                  src="https://i.pravatar.cc/100"
                  alt="avatar"
                />

                <h3>Daniel Beltran</h3>
              </div>

              <p className="post-text">
                El nuevo mapa me sorprendió con sus
                detalles, cada rincón se siente vivo.
              </p>

              <div className="post-actions">
                <div className="left-icons">
                  <Heart
                    onClick={() =>
                      setLiked(!liked)
                    }
                    fill={
                      liked
                        ? "#d5ff00"
                        : "transparent"
                    }
                    color={
                      liked
                        ? "#d5ff00"
                        : "white"
                    }
                    style={{ cursor: "pointer" }}
                  />

                  <MessageCircle
                    style={{ cursor: "pointer" }}
                  />

                  <Bookmark
                    onClick={() =>
                      setSaved(!saved)
                    }
                    fill={
                      saved
                        ? "#d5ff00"
                        : "transparent"
                    }
                    color={
                      saved
                        ? "#d5ff00"
                        : "white"
                    }
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <div className="rating">
                  {[1, 2, 3, 4, 5].map(
                    (star) => (
                      <span
                        key={star}
                        onClick={() =>
                          setRating(star)
                        }
                        style={{
                          cursor: "pointer",
                          color:
                            star <= rating
                              ? "#d5ff00"
                              : "#6f7480",
                        }}
                      >
                        ★
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT */}

        <section className="comments-section">
          <h2>Comments</h2>

          <div className="comments-list">
            {comments.map((comment) => (
              <div
                className="comment-card"
                key={comment.id}
              >
                <div className="comment-user">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="avatar"
                  />

                  <h3>{comment.name}</h3>
                </div>

                <p>{comment.text}</p>
              </div>
            ))}
          </div>

          <div className="comment-input">
            <input
              type="text"
              placeholder="Publica tu respuesta"
            />

            <button>
              <Send size={18} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Comments;