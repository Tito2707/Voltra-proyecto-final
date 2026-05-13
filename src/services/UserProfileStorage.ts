export const VOLTRA_PROFILE_STORAGE_KEY = "voltra_profile";

export type VoltraStoredProfile = {
  id: number;
  nombre: string;
  email: string;
  bio: string;
  avatar: string;
  banner: string;
  followers?: number;
  following?: number;
  reviewUsuario?: string;
};

export function readStoredProfile(): Partial<VoltraStoredProfile> | null {
  try {
    const raw = localStorage.getItem(VOLTRA_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<VoltraStoredProfile>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStoredProfile(data: VoltraStoredProfile): void {
  try {
    localStorage.setItem(VOLTRA_PROFILE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("No se pudo guardar el perfil en localStorage:", e);
    throw e;
  }
}

export function mergeUserWithStored<
  T extends {
    id: number;
    nombre: string;
    avatar: string;
    banner: string;
    bio: string;
    followers: number;
    following: number;
  },
>(base: T, stored: Partial<VoltraStoredProfile> | null): T & { email?: string; reviewUsuario?: string } {
  if (!stored) return { ...base };
  if (stored.id !== undefined && stored.id !== base.id) return { ...base };
  return {
    ...base,
    nombre: stored.nombre ?? base.nombre,
    email: stored.email,
    bio: stored.bio ?? base.bio,
    avatar: stored.avatar ?? base.avatar,
    banner: stored.banner ?? base.banner,
    followers: stored.followers ?? base.followers,
    following: stored.following ?? base.following,
    reviewUsuario: stored.reviewUsuario ?? base.nombre,
  };
}
