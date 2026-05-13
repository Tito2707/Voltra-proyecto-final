import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AuthLayout() {
  const isAuthenticated = localStorage.getItem("user");
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <div style={{ marginTop: "72px" }}>
        <Outlet />
      </div>
    </>
  );
}
