import {
  useState,
  useEffect,
} from "react";

import "./Comments.css";

import {
  Heart,
  Bookmark,
  MessageCircle,
  Send,
} from "lucide-react";

import hero from "../../assets/hero.png";

import {
  supabase,
} from "../../services/supabase";

function Comments() {
  const [liked, setLiked] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [rating, setRating] =
    useState(5);

  const [comments, setComments] =
    useState<any[]>([]);

  const [newComment, setNewComment] =
    useState("");

  const feedId =
    "5207b1ab-3eb9-4194-b91a-adc1e3ae6bc7";

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    const { data, error } =
      await supabase
        .from("comments")
        .select("*")
        .eq(
          "feed_id",
          feedId
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (!error && data) {
      setComments(data);
    }
  }

  async function sendComment() {
    if (!newComment.trim())
      return;

    const { error } =
      await supabase
        .from("comments")
        .insert({
          feed_id:
            feedId,

          username:
            "Alejandro",

          message:
            newComment,
        });

    if (!error) {
      setNewComment("");

      loadComments();
    }
  }

  return (
    <div className="comments-page">
      <div className="comments-container">

        {/* LEFT */}

        <section className="post-section">
          <h1>
            Explore!
          </h1>

          <p>
            Connect with the community
          </p>

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

                <h3>
                  Daniel Beltran
                </h3>

              </div>

              <p className="post-text">
                El nuevo mapa me sorprendió
                con sus detalles, cada rincón
                se siente vivo.
              </p>

              <div className="post-actions">

                <div className="left-icons">

                  <Heart
                    onClick={() =>
                      setLiked(
                        !liked
                      )
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
                    style={{
                      cursor:
                        "pointer",
                    }}
                  />

                  <MessageCircle />

                  <Bookmark
                    onClick={() =>
                      setSaved(
                        !saved
                      )
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
                    style={{
                      cursor:
                        "pointer",
                    }}
                  />

                </div>

                <div className="rating">

                  {[1, 2, 3, 4, 5].map(
                    (
                      star
                    ) => (
                      <span
                        key={
                          star
                        }
                        onClick={() =>
                          setRating(
                            star
                          )
                        }
                        style={{
                          cursor:
                            "pointer",

                          color:
                            star <=
                            rating
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

          <h2>
            Comments
          </h2>

          <div className="comments-list">

            {comments.map(
              (
                comment
              ) => (

                <div
                  className="comment-card"
                  key={
                    comment.id
                  }
                >

                  <div className="comment-user">

                    <img
                      src={
                        comment.avatar_url ||
                        "https://i.pravatar.cc/100"
                      }
                    />

                    <h3>
                      {
                        comment.username
                      }
                    </h3>

                  </div>

                  <p>
                    {
                      comment.message
                    }
                  </p>

                </div>

              )
            )}

          </div>

          <div className="comment-input">

            <input
              type="text"

              value={
                newComment
              }

              onChange={(
                e
              ) =>
                setNewComment(
                  e.target.value
                )
              }

              placeholder="Publica tu respuesta"
            />

            <button
              onClick={
                sendComment
              }
            >

              <Send
                size={18}
              />

            </button>

          </div>

        </section>

      </div>
    </div>
  );
}

export default Comments;