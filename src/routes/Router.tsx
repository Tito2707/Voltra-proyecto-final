import { createBrowserRouter, Navigate } from "react-router-dom";

import Landing from "../pages/landing/Landing";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Feed from "../pages/feed/Feed";
import Favorites from "../pages/favorites/Favorites";
import Profile from "../pages/profile/Profile";
import AuthLayout from "../layout/AuthLayout";
import Logout from "../pages/logout/Logout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;