import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  role: "police" | "user" | null;
  name: string | null;
  login: (token: string, role: "police" | "user", name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [name, setName] = useState<string | null>(() =>
    localStorage.getItem("name")
  );
  const [role, setRole] = useState<"police" | "user" | null>(() => {
    const saved = localStorage.getItem("role");
    return saved === "police" || saved === "user" ? saved : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (name) localStorage.setItem("name", name);
    else localStorage.removeItem("name");
  }, [name]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  const login = (
    newToken: string,
    newRole: "police" | "user",
    userName: string
  ) => {
    setToken(newToken);
    setRole(newRole);
    setName(userName);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, name, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
