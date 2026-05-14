import type { GameData } from "../types/Game";

const getReviews = async (): Promise<GameData[]> => {
  const res = await fetch("/data/games.json");
  const data: GameData[] = await res.json();
  return data;
};

export { getReviews };