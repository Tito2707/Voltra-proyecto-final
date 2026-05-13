import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import Feed from "./pages/feed/Feed";
import Favorites from "./pages/favorites/Favorites";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "110px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
