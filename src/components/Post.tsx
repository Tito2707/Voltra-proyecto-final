import PostInteraction from "./PostInteraction";

const Post = ({ game }: any) => {
  return (
    <div className="post-card">
      <img
        src={game.banner}
        alt={game.nombre}
        className="post-image"
      />

      <div className="post-content">
        <div className="post-user">
          <img
            src={game.avatar}
            alt={game.nombre}
            className="avatar"
          />

          <div>
            <h2>{game.nombre}</h2>
            <p>{game.bio}</p>
          </div>
        </div>

        <PostInteraction gameId={game.id} />
      </div>
    </div>
  );
};

export default Post;