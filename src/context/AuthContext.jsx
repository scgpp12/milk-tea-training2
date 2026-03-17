import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("ruitea_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  function login(token, userData) {
    localStorage.setItem("ruitea_token", token);
    localStorage.setItem("ruitea_user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("ruitea_token");
    localStorage.removeItem("ruitea_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
