import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-8 bg-voltra-bg">
      <h1
        className="text-voltra-accent text-5xl md:text-7xl font-bold mb-6"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        VOLTRA
      </h1>
      <p className="text-voltra-muted mb-10 max-w-md">
        Gaming & comunidad — explora y conecta.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/login"
          className="bg-voltra-accent text-voltra-on-accent font-semibold px-10 py-3 rounded-full no-underline hover:brightness-110 transition-all"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="border border-voltra-border-soft text-voltra-text font-semibold px-10 py-3 rounded-full no-underline hover:border-voltra-accent transition-colors"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
