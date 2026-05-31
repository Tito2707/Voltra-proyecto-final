import { supabase } from "../supabaseClient";

const getReviews = async () => {
  const { data, error } = await supabase
    .from("feed")
    .select("*");

  if (error) {
  console.log("CODE:", error.code);
  console.log("MESSAGE:", error.message);
  console.log("DETAILS:", error.details);
  return [];
}

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((post) => ({
  id: post.id,
  nombre: post.game_name,
  imagen: post.image_url,
  likes: post.likes,
  ranking_estrellas: post.ranking_estrellas,
  reseñas: [
    {
      usuario: post.usuario,
      reseña: post.content,
    },
  ],
}));
};
export { getReviews };
