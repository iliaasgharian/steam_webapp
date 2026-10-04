import { RouterRoutes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import GameDetailPage from "./pages/GameDetailPage";
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="game/:id" element={<GameDetailPage />} />
      <Route path="search" element={<SearchResultsPage />} />
    </RouterRoutes>
  );
}

export default App;