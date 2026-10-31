"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role } from "@/types/soc";
import { AuthUser, authenticateAdmin, authenticateStaff } from "@/lib/auth-adapter";

interface AuthContextType {
  role: Role | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  loginAsAdmin: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginAsStaff: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  logoutToStaff: () => void;
  isAuthenticatedAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  loginAsAdmin: async () => ({ success: false }),
  loginAsStaff: async () => ({ success: false }),
  logout: () => {},
  logoutToStaff: () => {},
  isAuthenticatedAdmin: false,
});

const SESSION_KEY = "project_x_session_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as AuthUser);
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const role: Role | null = isLoaded ? user?.role || null : null;
  const isAuthenticated = isLoaded && !!user;
  const isAdmin = isLoaded && user?.role === "admin";
  const isStaff = isLoaded && user?.role === "employee";

  const loginAsAdmin = async (
    identifier: string,
    pass: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await authenticateAdmin(identifier, pass);
    if (res.success && res.user) {
      setUser(res.user);
      try {
        const payload = JSON.stringify(res.user);
        if (rememberMe) {
          localStorage.setItem(SESSION_KEY, payload);
          sessionStorage.removeItem(SESSION_KEY);
        } else {
          sessionStorage.setItem(SESSION_KEY, payload);
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {}
      return { success: true };
    }
    return { success: false, error: res.error || "Authentication failed." };
  };

  const loginAsStaff = async (
    identifier: string,
    pass: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    const res = await authenticateStaff(identifier, pass);
    if (res.success && res.user) {
      setUser(res.user);
      try {
        const payload = JSON.stringify(res.user);
        if (rememberMe) {
          localStorage.setItem(SESSION_KEY, payload);
          sessionStorage.removeItem(SESSION_KEY);
        } else {
          sessionStorage.setItem(SESSION_KEY, payload);
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {}
      return { success: true };
    }
    return { success: false, error: res.error || "Authentication failed." };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  };

  const logoutToStaff = () => {
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAuthenticated,
        isAdmin,
        isStaff,
        loginAsAdmin,
        loginAsStaff,
        logout,
        logoutToStaff,
        isAuthenticatedAdmin: isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
