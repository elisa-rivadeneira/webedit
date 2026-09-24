import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then(({ data }) => {
        if (data.authenticated) setUsername(data.username);
      })
      .finally(() => setChecking(false));
  }, []);

  async function login(user, pass) {
    const { data } = await api.post('/auth/login', { username: user, password: pass });
    setUsername(data.username);
  }

  async function logout() {
    await api.post('/auth/logout');
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ username, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
