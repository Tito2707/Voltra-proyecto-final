import { Link } from "react-router-dom";

type ProfileBannerProps = {
  avatarSrc: string;
  name: string;
  bio?: string | null;
  bannerUrl?: string;
  editMode?: "none" | "edit" | "camera";
  editLink?: string;
  backLink?: string;
  onAvatarClick?: () => void;
};

const DEFAULT_BANNER = "/data/banner-image.jpg";

export default function ProfileBanner({
  avatarSrc,
  name,
  bio,
  bannerUrl = DEFAULT_BANNER,
  editMode = "none",
  editLink,
  backLink,
  onAvatarClick,
}: ProfileBannerProps) {
  return (
    <div className="profile-banner-wrap">
      <div className="profile-banner">
        <div
          className="profile-banner__image"
          style={{ backgroundImage: `url('${bannerUrl}')` }}
        >
          <div className="profile-banner__gradient" />
        </div>

        {backLink && (
          <Link to={backLink} className="profile-banner__back" aria-label="Volver">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}

        <div className="profile-banner__identity">
          <div className="profile-banner__avatar-wrap">
            <img src={avatarSrc} alt={name} className="profile-banner__avatar" />

            {editMode === "edit" && editLink && (
              <Link
                to={editLink}
                className="profile-banner__action-btn"
                aria-label="Editar perfil"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </Link>
            )}

            {editMode === "camera" && (
              <button
                type="button"
                onClick={onAvatarClick}
                className="profile-banner__action-btn"
                aria-label="Cambiar avatar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>

          <h1 className="profile-banner__name">{name}</h1>
          {bio && <p className="profile-banner__bio">{bio}</p>}
        </div>
      </div>
    </div>
  );
}
