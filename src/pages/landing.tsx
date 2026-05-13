import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignup = () => {
  navigate("/signup");
};

  return (
    <div className="landing-container">
      {/* Imagen de fondo */}
      <img
        src="/landing.png"
        alt="landing"
        className="background-image"
      />

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Contenido */}
      <div className="landing-content">
        <h2 className="welcome-text">Welcome</h2>

        <h1 className="logo-text">VOLTRA</h1>

        <p className="subtitle">Connect, play, rate</p>

        <button className="login-button" onClick={handleLogin}>
          Log in
        </button>

        <p className="signup-text">
          Don’t have an account?
          <span className="signup-link" onClick={handleSignup}>
            Create one
          </span>
        </p>
      </div>
    </div>
  );
};

export default Landing;