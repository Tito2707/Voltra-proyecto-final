import { Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import Feed from "./pages/feed";
import Favorites from "./pages/favorites";
import Comments from "./pages/comments";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/comments" element={<Comments />} />
    </Routes>
  );
}

export default App;