import { useRef, useState } from "react";
import "./CreatePost.css";

import {
  ChevronDown,
  X,
  ImagePlus,
} from "lucide-react";

import { supabase } from "../../../services/supabase";

const games = [
  "Minecraft",
  "Call of Duty",
  "Fortnite",
  "Valorant",
];

function CreatePost() {
  const [selectedGame, setSelectedGame] =
    useState("");

  const [dropdownOpen, setDropdownOpen] =
    useState(false);

  const [description, setDescription] =
    useState("");

  const [rating, setRating] =
    useState(2);

  const [image, setImage] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      const imageUrl =
        URL.createObjectURL(file);

      setImage(imageUrl);
    }
  };

  const handleCreatePost =
    async () => {
      try {
        if (
          !selectedGame ||
          !description
        ) {
          alert(
            "Completa todos los campos"
          );
          return;
        }

        setLoading(true);

        const { error } =
          await supabase
            .from("feed")
            .insert([
              {
                content:
                  description,

                image_url:
                  image,

                user_id:
                  "11111111-1111-1111-1111-111111111111",

                game_name:
                  selectedGame,

                ranking_estrellas:
                  rating,

                usuario:
                  "Alejandro",

                likes: 0,

                is_favorite:
                  false,
              },
            ]);

        if (error) {
          console.log(error);

          alert(
            "Error creando publicación"
          );

          return;
        }

        alert(
          "Publicación creada"
        );

        setSelectedGame("");

        setDescription("");

        setRating(2);

        setImage(null);

      } catch (error) {

        console.log(error);

        alert(
          "Error creando publicación"
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <div className="create-post-page">

      <div className="create-post-card">

        <div
          className="upload-area"
          onClick={() =>
            inputRef.current?.click()
          }
        >

          {image ? (
            <img
              src={image}
              alt="preview"
              className="preview-image"
            />
          ) : (
            <div className="upload-placeholder">
              <ImagePlus size={80} />
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={
              handleImageUpload
            }
          />

        </div>

        <div className="dropdown-container">

          <div
            className="dropdown-header"
            onClick={() =>
              setDropdownOpen(
                !dropdownOpen
              )
            }
          >

            <span>
              {selectedGame ||
                "select your game"}
            </span>

            <div className="dropdown-icons">

              <X
                size={18}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGame("");
                }}
              />

              <div className="divider" />

              <ChevronDown size={20} />

            </div>

          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">

              {games.map(
                (game) => (
                  <div
                    key={game}
                    className={`dropdown-item ${
                      selectedGame === game
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedGame(
                        game
                      );

                      setDropdownOpen(
                        false
                      );
                    }}
                  >
                    {game}
                  </div>
                )
              )}

            </div>
          )}

        </div>

        <textarea
          placeholder="Tell us your adventure in this game..."
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <div className="post-footer">

          <div className="rating-wrapper">

            <p>
              Rate your experience...
            </p>

            <div className="rating">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <span
                    key={star}
                    onClick={() =>
                      setRating(
                        star
                      )
                    }
                    style={{
                      color:
                        star <= rating
                          ? "#d5ff00"
                          : "transparent",
                    }}
                  >
                    ★
                  </span>
                )
              )}

            </div>

          </div>

          <div className="buttons">

            <button
              className="cancel-btn"
              onClick={() => {
                setSelectedGame("");
                setDescription("");
                setRating(2);
                setImage(null);
              }}
            >
              Cancel
            </button>

            <button
              className="post-btn"
              onClick={
                handleCreatePost
              }
              disabled={
                loading
              }
            >
              {
                loading
                  ? "Posting..."
                  : "Post"
              }
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreatePost;