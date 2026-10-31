"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RoleNavbar } from "./RoleNavbar";
import { useAuth } from "@/context/AuthContext";

export const NavigationWrapper: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAuth();
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/health", { cache: "no-store" });
        setIsBackendConnected(res.ok);
      } catch {
        setIsBackendConnected(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  let activeTab = "overview";
  if (pathname === "/staff" || pathname === "/staff/login") activeTab = "staff";
  else if (pathname.startsWith("/admin")) activeTab = "admin";
  else if (pathname === "/attacks") activeTab = "attacks";
  else if (pathname === "/audit") activeTab = "audit";
  else if (pathname === "/login") activeTab = "login";

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "overview":
        router.push("/");
        break;
      case "staff":
        if (role === "employee" || role === "admin") {
          router.push("/staff");
        } else {
          router.push("/staff/login?redirect=/staff");
        }
        break;
      case "admin":
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/login?redirect=/admin");
        }
        break;
      case "attacks":
        router.push("/attacks");
        break;
      case "audit":
        router.push("/audit");
        break;
      default:
        router.push("/");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <RoleNavbar
      currentRole={role}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      isBackendConnected={isBackendConnected}
    />
  );
};
