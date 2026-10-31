"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role } from "@/types/soc";

interface AuthContextType {
  role: Role;
  user: string | null;
  isAuthenticatedAdmin: boolean;
  loginAsAdmin: (username: string, pass: string) => boolean;
  logoutToStaff: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: "employee",
  user: null,
  isAuthenticatedAdmin: false,
  loginAsAdmin: () => false,
  logoutToStaff: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>("employee");
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Hydrate from localStorage if available
    const savedRole = localStorage.getItem("project_x_role") as Role;
    const savedUser = localStorage.getItem("project_x_user");
    if (savedRole === "admin") {
      setRole("admin");
      setUser(savedUser || "admin@secops.local");
    }
  }, []);

  const loginAsAdmin = (username: string, pass: string): boolean => {
    if (pass.trim() === "admin123" || username.includes("admin")) {
      const adminUser = username || "admin@secops.local";
      setRole("admin");
      setUser(adminUser);
      localStorage.setItem("project_x_role", "admin");
      localStorage.setItem("project_x_user", adminUser);
      return true;
    }
    return false;
  };

  const logoutToStaff = () => {
    setRole("employee");
    setUser(null);
    localStorage.removeItem("project_x_role");
    localStorage.removeItem("project_x_user");
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAuthenticatedAdmin: role === "admin",
        loginAsAdmin,
        logoutToStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
