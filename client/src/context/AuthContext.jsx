import {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the saved login when the app opens
  useEffect(() => {
    const savedToken = localStorage.getItem('devshelf_token');
    const savedUser = localStorage.getItem('devshelf_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('devshelf_token');
        localStorage.removeItem('devshelf_user');
      }
    }

    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const {
      token: receivedToken,
      id,
      userName,
      email: userEmail,
    } = response.data;

    const userData = {
      id,
      userName,
      email: userEmail,
    };

    setToken(receivedToken);
    setUser(userData);

    localStorage.setItem('devshelf_token', receivedToken);
    localStorage.setItem(
      'devshelf_user',
      JSON.stringify(userData)
    );

    return response.data;
  };

  // Register
  const register = async (userName, email, password) => {
    const response = await api.post('/auth/register', {
      userName,
      email,
      password,
    });

    return response.data;
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('devshelf_token');
    localStorage.removeItem('devshelf_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Access authentication from any component
export function useAuth() {
  return useContext(AuthContext);
}
