import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const users = JSON.parse(localStorage.getItem("users") || "[]") as Array<{
      id: string;
      username: string;
      email: string;
      password: string;
    }>;
    const user = users.find(
      (u) =>
        (u.email === formData.usernameOrEmail || u.username === formData.usernameOrEmail) &&
        u.password === formData.password
    );
    if (!user) {
      setError("Usuario o contraseña incorrectos");
      return;
    }
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        loggedInAt: new Date().toISOString(),
      })
    );
    if (rememberMe) localStorage.setItem("rememberMe", "true");
    navigate("/auth/feed");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-voltra-bg">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md bg-voltra-bg md:bg-transparent border border-voltra-border-soft md:border-0 p-8 md:p-0 rounded-3xl md:rounded-none">
          <h1 className="text-left md:text-center text-voltra-accent text-3xl md:text-5xl font-bold mb-6">
            Login
          </h1>
          <p className="text-voltra-muted text-left md:text-center text-sm mb-6 md:hidden">
            Introduce tus datos para entrar.
          </p>
          {error && (
            <div className="bg-voltra-accent/10 border border-voltra-accent text-voltra-text p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Usuario o email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              autoComplete="username"
              required
              className="w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-muted border border-voltra-border-soft px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-muted border border-voltra-border-soft px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent"
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-voltra-accent"
              />
              <label htmlFor="remember" className="text-voltra-muted text-sm">
                Recordarme
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-voltra-accent text-voltra-on-accent font-semibold py-3 rounded-full hover:brightness-110 transition-colors"
            >
              Entrar
            </button>
            <p className="text-center text-voltra-muted text-sm">
              ¿Sin cuenta?{" "}
              <Link to="/register" className="text-voltra-accent hover:underline">
                Crear cuenta
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div className="hidden md:block w-1/2 relative min-h-[50vh]">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>
    </div>
  );
}
