import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, getAuthErrorMessage } from "../../services/AuthService";
import { ensureProfile } from "../../services/ProfileService";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await signIn(
      formData.usernameOrEmail,
      formData.password
    );

    if (authError) {
      setError(getAuthErrorMessage(authError.message));
      setLoading(false);
      return;
    }

    if (!data.session?.user) {
      setError("No se pudo iniciar sesión.");
      setLoading(false);
      return;
    }

    const meta = data.session.user.user_metadata as { username?: string; full_name?: string };
    void ensureProfile(
      data.session.user.id,
      meta.username || data.session.user.email?.split("@")[0] || "user",
      meta.full_name
    );
    setLoading(false);
    navigate("/feed");
  };

  const fieldClass =
    "w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-text/50 border border-voltra-text/10 px-4 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-voltra-bg">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md bg-voltra-bg md:bg-transparent border border-voltra-text/10 md:border-0 p-8 md:p-0 rounded-3xl md:rounded-none">
          <h1 className="text-left md:text-center text-voltra-accent text-3xl md:text-5xl font-bold mb-8">
            Login
          </h1>
          {error && (
            <div className="bg-voltra-accent/10 border border-voltra-accent text-voltra-text p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Usuario o email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              autoComplete="username"
              required
              className={fieldClass}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className={fieldClass}
            />
            <button type="submit" disabled={loading} className="voltra-btn w-full py-3.5 auth-form-submit">
              {loading ? "Entrando…" : "Entrar"}
            </button>
            <p className="text-center text-voltra-text/60 text-sm auth-form-footer">
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
