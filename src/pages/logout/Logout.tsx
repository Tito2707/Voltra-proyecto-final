import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../services/AuthService";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      await signOut();
      navigate("/login", { replace: true });
    };
    void run();
  }, [navigate]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-voltra-text/60">
      <div className="inline-block size-8 animate-spin rounded-full border-4 border-voltra-accent border-t-transparent" />
    </div>
  );
}
