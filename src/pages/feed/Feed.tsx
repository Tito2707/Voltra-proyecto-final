import Post from "../../components/Post";

export default function Feed() {
  return (
    <div className="px-4 py-8">
      <h1 className="text-voltra-accent font-bold text-3xl md:text-4xl mb-2">Explore!</h1>
      <p className="text-voltra-text mb-8">Connect with the community.</p>
      <Post />
    </div>
  );
}
