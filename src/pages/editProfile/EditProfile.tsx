import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  readStoredProfile,
  writeStoredProfile,
  mergeUserWithStored,
  type VoltraStoredProfile,
} from "../../services/UserProfileStorage";

interface User {
  id: number;
  nombre: string;
  avatar: string;
  banner: string;
  bio: string;
  followers: number;
  following: number;
}

const DEFAULT_USER = "CraftyCat";

export default function EditProfile() {
  const navigate = useNavigate();
  const [baseUser, setBaseUser] = useState<User | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/users.json");
        const users: User[] = await res.json();
        const found = users.find((u) => u.nombre === DEFAULT_USER) || users[0];
        setBaseUser(found);
        const stored = readStoredProfile();
        const merged = mergeUserWithStored(found, stored);
        setNombre(merged.nombre);
        setEmail(merged.email ?? "");
        setBio(merged.bio);
        setAvatar(merged.avatar);
        setBanner(merged.banner);
      } catch (e) {
        console.error("Error loading user:", e);
      }
    };
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!baseUser) return;
    setSaving(true);
    const existing = readStoredProfile();
    const payload: VoltraStoredProfile = {
      id: baseUser.id,
      nombre: nombre.trim() || baseUser.nombre,
      email: email.trim(),
      bio: bio.trim(),
      avatar: avatar.trim() || baseUser.avatar,
      banner: banner.trim() || baseUser.banner,
      followers: baseUser.followers,
      following: baseUser.following,
      reviewUsuario: existing?.reviewUsuario ?? baseUser.nombre,
    };
    try {
      writeStoredProfile(payload);
      window.dispatchEvent(new Event("voltra-profile-updated"));
      navigate("/profile");
    } catch {
      window.alert(
        "Could not save your changes. If you used very large images, try smaller files or shorter image URLs."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!baseUser) {
    return (
      <div className="w-screen min-h-screen bg-voltra-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-voltra-accent" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-voltra-bg pb-16"
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}
    >
      <Navbar />

      <div
        className="relative w-full overflow-hidden"
        style={{
          height: "420px",
          marginTop: "-110px",
          paddingTop: "110px",
        }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('${banner}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-voltra-bg" />
        </div>

        <Link
          to="/profile"
          className="absolute left-4 top-4 z-30 inline-flex items-center justify-center w-11 h-11 rounded-full bg-voltra-bg/90 border border-voltra-text/20 text-voltra-text hover:border-voltra-accent transition-colors no-underline"
          aria-label="Back to profile"
        >
          <i className="bi bi-arrow-left text-lg" />
        </Link>

        <label className="absolute right-4 top-4 z-30 cursor-pointer inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/55 text-voltra-accent border border-voltra-accent/80 hover:bg-black/70 transition-colors backdrop-blur-sm">
          <i className="bi bi-camera-fill text-lg" />
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(ev) => {
              const file = ev.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === "string") setBanner(reader.result);
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>

        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-4 z-20 pointer-events-none">
          <div className="relative mb-3 pointer-events-auto">
            <img
              src={avatar}
              alt={nombre}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-voltra-accent shadow-2xl object-cover bg-voltra-bg"
            />
            <label className="absolute bottom-0 right-0 bg-voltra-accent text-voltra-bg p-2 rounded-full shadow-lg w-10 h-10 flex items-center justify-center border border-voltra-accent hover:bg-voltra-accent/90 transition cursor-pointer">
              <i className="bi bi-camera-fill text-sm" />
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(ev) => {
                  const file = ev.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === "string") setAvatar(reader.result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 md:px-6 -mt-4 relative z-30 pb-8">
        <h1 className="text-voltra-accent text-2xl md:text-3xl font-bold font-poppins mb-6 text-center">
          Edit profile
        </h1>

        <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="edit-name" className="block text-voltra-text text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl bg-voltra-bg border border-voltra-text/15 px-4 py-3 text-voltra-text placeholder:text-voltra-text/45 focus:outline-none focus:ring-2 focus:ring-voltra-accent focus:border-voltra-accent"
              placeholder="Your display name"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-voltra-text text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-voltra-bg border border-voltra-text/15 px-4 py-3 text-voltra-text placeholder:text-voltra-text/45 focus:outline-none focus:ring-2 focus:ring-voltra-accent focus:border-voltra-accent"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="edit-bio" className="block text-voltra-text text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-voltra-bg border border-voltra-text/15 px-4 py-3 text-voltra-text placeholder:text-voltra-text/45 focus:outline-none focus:ring-2 focus:ring-voltra-accent focus:border-voltra-accent resize-y min-h-[120px]"
              placeholder="Tell the community about you..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-voltra-accent hover:bg-voltra-accent/90 text-voltra-bg font-semibold py-3.5 transition disabled:opacity-60 border border-voltra-accent"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
