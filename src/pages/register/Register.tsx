import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, signIn, getAuthErrorMessage } from "../../services/AuthService";
import { ensureProfile } from "../../services/ProfileService";

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
  const [loading, setLoading] = useState(false);

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

  const finishRegister = (userId: string) => {
    void ensureProfile(userId, formData.username, formData.username);
    setLoading(false);
    navigate("/feed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    if (!validateForm()) return;

    setLoading(true);

    const { data, error } = await signUp(
      formData.email,
      formData.password,
      formData.username
    );

    if (error) {
      setErrors([getAuthErrorMessage(error.message)]);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setErrors(["No se pudo crear la cuenta. Prueba con otro email."]);
      setLoading(false);
      return;
    }

    if (data.session?.user) {
      finishRegister(data.session.user.id);
      return;
    }

    const { data: loginData, error: loginError } = await signIn(
      formData.email,
      formData.password
    );

    if (loginError || !loginData.session?.user) {
      setErrors([
        getAuthErrorMessage(
          loginError?.message ?? "No se pudo iniciar sesión después de crear la cuenta."
        ),
      ]);
      setLoading(false);
      return;
    }

    finishRegister(loginData.session.user.id);
  };

  const fieldClass =
    "w-full bg-voltra-bg text-voltra-text placeholder:text-voltra-text/50 border border-voltra-text/10 px-4 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-voltra-accent";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-voltra-bg">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-lg bg-voltra-bg md:bg-transparent border border-voltra-text/10 md:border-0 p-8 md:p-0 rounded-3xl md:rounded-none">
          <h1 className="text-voltra-accent text-left md:text-center text-4xl md:text-5xl font-bold mb-8">
            Registro
          </h1>
          {errors.length > 0 && (
            <div className="bg-voltra-accent/10 border border-voltra-accent text-voltra-text p-3 rounded-lg mb-6 text-sm space-y-1">
              {errors.map((err, i) => (
                <p key={i}>• {err}</p>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              value={formData.username}
              onChange={handleChange}
              required
              className={fieldClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={fieldClass}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              className={fieldClass}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={fieldClass}
            />
            <div className="flex items-center gap-3 auth-form-terms">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 accent-voltra-accent"
              />
              <label htmlFor="terms" className="text-voltra-text/60 text-sm">
                Acepto los términos
              </label>
            </div>
            <button type="submit" disabled={loading} className="voltra-btn w-full py-3.5 auth-form-submit">
              {loading ? "Creando cuenta…" : "Crear cuenta"}
            </button>
            <p className="text-center text-voltra-text/60 text-sm auth-form-footer">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-voltra-accent hover:underline">
                Iniciar sesión
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
