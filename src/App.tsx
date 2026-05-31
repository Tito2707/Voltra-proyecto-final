import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { SearchProvider } from "./context/SearchContext";

import Feed from "./pages/feed/Feed";
import Favorites from "./pages/favorites/Favorites";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Logout from "./pages/logout/Logout";
import MyProfile from "./pages/profile/MyProfile";
import ViewProfile from "./pages/profile/ViewProfile";
import EditProfile from "./pages/editProfile/EditProfile";

function App() {
  return (
    <SearchProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <div style={{ marginTop: "110px" }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/feed" replace />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <MyProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/edit-profile"
                      element={
                        <ProtectedRoute>
                          <EditProfile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/profile/:username" element={<ViewProfile />} />
                  </Routes>
                </div>
              </>
            }
          />
        </Routes>
      </Router>
    </SearchProvider>
  );
}

export default App;
