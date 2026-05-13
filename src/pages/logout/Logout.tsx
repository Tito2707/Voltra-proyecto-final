import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-voltra-muted">
      <div className="inline-block size-8 animate-spin rounded-full border-4 border-voltra-accent border-t-transparent" />
    </div>
  );
}
