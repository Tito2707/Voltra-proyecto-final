import { supabase } from "../supabaseClient";
import type { Profile } from "../types/Profile";
import type { GameData } from "../types/Game";
import { mapFeedRow } from "./ReviewService";

type FeedPost = {
  id: string;
  content: string;
  image_url: string | null;
  game_name: string | null;
  likes: number | null;
  ranking_estrellas: number | null;
  usuario: string | null;
};

const mapFeedPost = (post: FeedPost): GameData => mapFeedRow(post);

const getProfileById = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
};

const getProfileAvatar = async (userId: string): Promise<string> => {
  const { data } = await supabase
    .from("profiles")
    .select("avatar_url, username")
    .eq("id", userId)
    .maybeSingle();

  if (data?.avatar_url) return data.avatar_url;
  const label = data?.username ?? userId;
  return `https://i.pravatar.cc/80?u=${encodeURIComponent(label)}`;
};

const getMyProfileData = async (userId: string) => {
  const [profileRes, postsRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase
      .from("feed")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const posts = (postsRes.data ?? []) as FeedPost[];

  return {
    profile: (profileRes.data as Profile | null) ?? null,
    postCount: posts.length,
    games: posts.map(mapFeedPost),
  };
};

const getProfileByUsername = async (username: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error || !data) return null;
  return data as Profile;
};

const getPostCount = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("feed")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (error) return 0;
  return count ?? 0;
};

const getPostsByUserId = async (userId: string): Promise<GameData[]> => {
  const { data, error } = await supabase
    .from("feed")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as FeedPost[]).map(mapFeedPost);
};

const getPostsByUsuario = async (usuario: string): Promise<GameData[]> => {
  const { data, error } = await supabase
    .from("feed")
    .select("*")
    .eq("usuario", usuario)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as FeedPost[]).map(mapFeedPost);
};

const ensureProfile = async (
  userId: string,
  username: string,
  fullName?: string
): Promise<Profile | null> => {
  const trimmedUsername = username.trim();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        username: trimmedUsername,
        full_name: fullName?.trim() || trimmedUsername,
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();

  if (error || !data) return null;
  return data as Profile;
};

const updateProfile = async (
  userId: string,
  updates: {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string | null;
  }
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();
  if (error || !data) return null;
  return data as Profile;
};

const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/avatar.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return null;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
};

const removeAvatarFiles = async (userId: string) => {
  const { data: files } = await supabase.storage.from("avatars").list(userId);
  if (!files?.length) return;
  const paths = files.map((f: { name: string }) => `${userId}/${f.name}`);
  await supabase.storage.from("avatars").remove(paths);
};

export {
  getProfileById,
  getProfileAvatar,
  getProfileByUsername,
  getMyProfileData,
  getPostCount,
  getPostsByUserId,
  getPostsByUsuario,
  ensureProfile,
  updateProfile,
  uploadAvatar,
  removeAvatarFiles,
};
