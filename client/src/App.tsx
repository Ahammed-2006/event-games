import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';

import Challenges from './pages/Challenges';
import Rules from './pages/Rules';
import Leaderboard from './pages/Leaderboard';
import WordSearch from './challenges/word-search/WordSearch';
import JigsawPuzzle from './challenges/jigsaw/JigsawPuzzle';
import DebugCode from './challenges/debug-code/DebugCode';
import AdminDashboard from './pages/AdminDashboard';
import StudentPortal from './pages/StudentPortal';

function AppRoutes() {
  const { user, isAdmin, isTeam } = useAuth();

  // Not logged in → show login
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // Admin → admin dashboard (no game Layout)
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  // Team
  if (isTeam) {
    return (
      <Routes>
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<StudentPortal />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="challenges/word-search" element={<WordSearch />} />
          <Route path="challenges/jigsaw" element={<JigsawPuzzle />} />
          <Route path="challenges/debug-code" element={<DebugCode />} />
          <Route path="rules" element={<Rules />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  return <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
