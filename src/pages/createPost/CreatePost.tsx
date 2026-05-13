import { useRef, useState } from "react";

import "./CreatePost.css";

import {
  ChevronDown,
  X,
  ImagePlus,
} from "lucide-react";

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

  const [rating, setRating] = useState(2);

  const [image, setImage] = useState<
    string | null
  >(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl =
        URL.createObjectURL(file);

      setImage(imageUrl);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">
        {/* IMAGE */}

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
            onChange={handleImageUpload}
          />
        </div>

        {/* SELECT */}

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
              {games.map((game) => (
                <div
                  key={game}
                  className={`dropdown-item ${
                    selectedGame === game
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedGame(game);

                    setDropdownOpen(false);
                  }}
                >
                  {game}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TEXTAREA */}

        <textarea
          placeholder="Tell us your adventure in this game..."
          value={description}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement>
          ) =>
            setDescription(
              e.target.value
            )
          }
        />

        {/* FOOTER */}

        <div className="post-footer">
          <div className="rating-wrapper">
            <p>Rate your experience...</p>

            <div className="rating">
              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <span
                    key={star}
                    onClick={() =>
                      setRating(star)
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
            <button className="cancel-btn">
              Cancel
            </button>

            <button className="post-btn">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;