import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicPage from './pages/PublicPage';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

function AdminGate() {
  const { username, checking } = useAuth();

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center text-ink/50">Cargando…</div>;
  }

  return username ? <AdminPanel /> : <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/admin" element={<AdminGate />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
