import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  getSessionUserId,
  hasActiveSession,
  isSessionReady,
} from "../services/AuthService";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(isSessionReady());
  const [authenticated, setAuthenticated] = useState(hasActiveSession());

  useEffect(() => {
    if (isSessionReady()) return;

    let active = true;
    getSessionUserId().then((userId) => {
      if (!active) return;
      setAuthenticated(!!userId);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-voltra-accent" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
