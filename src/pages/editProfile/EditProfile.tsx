import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession } from "../../services/AuthService";
import {
  getProfileById,
  updateProfile,
  uploadAvatar,
} from "../../services/ProfileService";
import type { Profile } from "../../types/Profile";

export default function EditProfile() {
  const navigate = useNavigate();
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

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <Link to="/profile" className="text-voltra-accent text-sm hover:underline mb-6 inline-block">
        ← Volver al perfil
      </Link>
      <h1 className="text-voltra-accent text-2xl font-bold mb-6">Editar perfil</h1>
      {error && (
        <div className="bg-voltra-accent/10 border border-voltra-accent text-voltra-text p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-3">
          <img
            src={avatarPreview}
            alt={username}
            className="w-28 h-28 rounded-full border-2 border-voltra-accent/40 object-cover"
          />
          <label className="cursor-pointer text-voltra-accent text-sm border border-voltra-accent/60 px-4 py-2 rounded-full">
            Cambiar avatar
            <input
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
          </label>
        </div>
        <div>
          <label htmlFor="edit-username" className="block text-voltra-text text-sm mb-2">
            Usuario
          </label>
          <input
            id="edit-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-xl bg-voltra-bg border border-voltra-text/15 px-4 py-3 text-voltra-text focus:outline-none focus:ring-2 focus:ring-voltra-accent"
          />
        </div>
        <div>
          <label htmlFor="edit-fullname" className="block text-voltra-text text-sm mb-2">
            Nombre
          </label>
          <input
            id="edit-fullname"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl bg-voltra-bg border border-voltra-text/15 px-4 py-3 text-voltra-text focus:outline-none focus:ring-2 focus:ring-voltra-accent"
          />
        </div>
        <div>
          <label htmlFor="edit-bio" className="block text-voltra-text text-sm mb-2">
            Bio
          </label>
          <textarea
            id="edit-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-xl bg-voltra-bg border border-voltra-text/15 px-4 py-3 text-voltra-text focus:outline-none focus:ring-2 focus:ring-voltra-accent resize-y"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="voltra-btn w-full py-3.5 mt-2 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
