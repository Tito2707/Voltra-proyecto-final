import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ProfileBanner from "../../components/ProfileBanner";
import { getSession } from "../../services/AuthService";
import {
  getProfileById,
  updateProfile,
  uploadAvatar,
} from "../../services/ProfileService";
import type { Profile } from "../../types/Profile";

export default function EditProfile() {
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await getSession();
      const userId = data.session?.user.id;
      if (!userId) return;
      const p = await getProfileById(userId);
      if (!p) return;
      setProfile(p);
      setUsername(p.username);
      setFullName(p.full_name ?? "");
      setBio(p.bio ?? "");
      setAvatarPreview(
        p.avatar_url || `https://i.pravatar.cc/120?u=${encodeURIComponent(p.username)}`
      );
    };
    void load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError("");
    let avatarUrl = profile.avatar_url;
    if (avatarFile) {
      const uploaded = await uploadAvatar(profile.id, avatarFile);
      if (!uploaded) {
        setError("No se pudo subir el avatar.");
        setSaving(false);
        return;
      }
      avatarUrl = uploaded;
    }
    const updated = await updateProfile(profile.id, {
      username: username.trim(),
      full_name: fullName.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl,
    });
    if (!updated) {
      setError("No se pudo guardar. El usuario puede estar en uso.");
      setSaving(false);
      return;
    }
    navigate("/profile");
  };

  if (!profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent" />
      </div>
    );
  }

  const displayName = fullName || username;

  return (
    <div className="min-h-screen bg-voltra-bg">
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(ev) => {
          const file = ev.target.files?.[0];
          if (!file) return;
          setAvatarFile(file);
          setAvatarPreview(URL.createObjectURL(file));
        }}
      />

      <ProfileBanner
        avatarSrc={avatarPreview}
        name={displayName}
        bio={bio}
        editMode="camera"
        backLink="/profile"
        onAvatarClick={() => avatarInputRef.current?.click()}
      />

      <div className="page-container pb-12 pt-4">
        <div className="form-container">
          {error && (
            <div className="bg-voltra-accent/10 border border-voltra-accent text-voltra-text p-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div>
              <label htmlFor="edit-fullname" className="voltra-input-label">
                Nombre
              </label>
              <input
                id="edit-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="voltra-input"
              />
            </div>

            <div className="edit-profile-form__bio">
              <label htmlFor="edit-bio" className="voltra-input-label">
                Descripción
              </label>
              <textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className="voltra-input resize-y min-h-[140px] md:min-h-[220px]"
              />
            </div>

            <div>
              <label htmlFor="edit-username" className="voltra-input-label">
                Usuario
              </label>
              <input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="voltra-input"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="voltra-btn w-full py-3.5 disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
