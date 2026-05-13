import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

import Feed from "./pages/feed/Feed";
import Favorites from "./pages/favorites/Favorites";
import Logout from "./pages/logout/Logout";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "110px" }}>
        <Routes>
          <Route path="/feed" element={<Feed />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
