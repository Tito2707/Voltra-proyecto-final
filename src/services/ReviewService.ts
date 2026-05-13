const STORAGE_KEY = "voltra_games";

function gamesJsonUrl(): string {
  const raw = import.meta.env.BASE_URL ?? "/";
  const base = raw.endsWith("/") ? raw : `${raw}/`;
  return `${base}data/games.json`;
}

function readStored<T>(): T[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as T[];
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

async function fetchFromFile<T>(): Promise<T[]> {
  const res = await fetch(gamesJsonUrl());
  if (!res.ok) throw new Error(`games.json (${res.status})`);
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function getReviews<T = unknown>(): Promise<T[]> {
  const cached = readStored<T>();
  if (cached !== null && cached.length > 0) return cached;
  const fresh = await fetchFromFile<T>();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

export function saveReviews<T>(data: T[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
