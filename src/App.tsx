import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import Feed from "./pages/feed";
import Favorites from "./pages/favorites";
import Login from "./pages/login";
import Signup from "./pages/SignUp";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;