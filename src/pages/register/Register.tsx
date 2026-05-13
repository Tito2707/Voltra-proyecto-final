import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (formData.username.length < 3) newErrors.push("Usuario: mínimo 3 caracteres");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.push("Email no válido");
    if (formData.password.length < 6) newErrors.push("Contraseña: mínimo 6 caracteres");
    if (formData.password !== formData.confirmPassword) newErrors.push("Las contraseñas no coinciden");
    if (!acceptTerms) newErrors.push("Acepta los términos");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    type UserRow = { id: string; username: string; email: string; password: string; createdAt: string };
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]") as UserRow[];
    const exists = existingUsers.some((u) => u.email === formData.email || u.username === formData.username);
    if (exists) {
      setErrors(["Ya existe una cuenta con ese email o usuario"]);
      return;
    }
    existingUsers.push({
      id: Date.now().toString(),
      username: formData.username,
      email: formData.email,
      password: formData.password,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("users", JSON.stringify(existingUsers));
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-voltra-bg">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg bg-voltra-bg md:bg-transparent border border-voltra-border-soft md:border-0 p-8 md:p-0 rounded-3xl md:rounded-none">
          <h1 className="text-voltra-accent text-left md:text-center text-4xl md:text-5xl font-bold mb-6">
            Registro
          </h1>
          <p className="text-voltra-muted text-left md:text-center mb-6">
            Crea tu cuenta en VOLTRA.
          </p>
          {errors.length > 0 && (
            <div className="bg-voltra-accent/10 border border-voltra-accent text-voltra-text p-3 rounded-lg mb-4 text-sm space-y-1">
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-muted border border-voltra-border-soft px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-muted border border-voltra-border-soft px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-muted border border-voltra-border-soft px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-muted border border-voltra-border-soft px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent"
            />
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 accent-voltra-accent"
              />
              <label htmlFor="terms" className="text-voltra-muted text-sm">
                Acepto los términos
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-voltra-accent text-voltra-on-accent font-semibold py-3 rounded-lg hover:brightness-110 transition-colors"
            >
              Crear cuenta
            </button>
            <p className="text-center text-voltra-muted text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-voltra-accent hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div className="hidden md:block w-1/2 relative min-h-[50vh]">
        <img
          src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>
    </div>
  );
}
