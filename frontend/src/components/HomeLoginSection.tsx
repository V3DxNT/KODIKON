"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { SentinelForgeLogo } from "./SentinelForgeLogo";

export const HomeLoginSection: React.FC = () => {
  const router = useRouter();
  const { loginAsAdmin, loginAsStaff } = useAuth();

  const [activePortal, setActivePortal] = useState<"admin" | "staff">("admin");
  const [adminUsername, setAdminUsername] = useState("admin@secops.local");
  const [adminPassword, setAdminPassword] = useState("admin123");
  const [staffUsername, setStaffUsername] = useState("staff@secops.local");
  const [staffPassword, setStaffPassword] = useState("staff123");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showStaffPass, setShowStaffPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await loginAsAdmin(adminUsername, adminPassword, true);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error || "Invalid administrator credentials. Demo key is 'admin123'.");
      }
    } catch {
      setError("An unexpected error occurred during admin authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await loginAsStaff(staffUsername, staffPassword, true);
      if (res.success) {
        router.push("/staff");
      } else {
        setError(res.error || "Invalid staff credentials. Demo key is 'staff123'.");
      }
    } catch {
      setError("An unexpected error occurred during staff authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="login-portal" className="bg-white rounded-3xl p-8 sm:p-12 space-y-8 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div className="flex items-start space-x-3.5">
          <SentinelForgeLogo variant="symbol" size="md" className="hidden sm:inline-flex mt-1" />
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">
              SENTINEL FORGE • RBAC ACCESS PORTAL
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Sign In to the Operational Console
            </h3>
            <p className="text-xs text-slate-600 mt-1 font-normal">
              Choose your clearance level: General Staff awareness or Privileged Security Administrator.
            </p>
          </div>
        </div>

        {/* Segmented Portal Switcher Tabs */}
        <div className="flex items-center p-1 rounded-lg bg-slate-100 border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActivePortal("admin");
              setError(null);
            }}
            className={`flex items-center space-x-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activePortal === "admin"
                ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>Admin Portal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActivePortal("staff");
              setError(null);
            }}
            className={`flex items-center space-x-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activePortal === "staff"
                ? "bg-white text-slate-900 font-semibold shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="h-3.5 w-3.5 text-emerald-600" />
            <span>Staff Portal</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="rounded-lg bg-rose-50 p-3.5 border border-rose-200 text-xs text-rose-700 flex items-start space-x-2.5 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Login Portal Form */}
      {activePortal === "admin" ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
            <span>Privileged Clearance (Firewall enforcement & Caldera verification)</span>
            <button
              type="button"
              onClick={() => {
                setAdminUsername("admin@secops.local");
                setAdminPassword("admin123");
                setError(null);
              }}
              className="font-mono text-[11px] text-blue-600 hover:underline cursor-pointer font-medium"
            >
              Fill Demo Admin
            </button>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-700">
                ADMINISTRATOR IDENTITY
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full rounded-lg bg-slate-50/70 px-4 py-2.5 text-xs font-mono text-slate-900 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                placeholder="admin@secops.local"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-700">
                SECURITY PASSKEY
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-50/70 px-4 py-2.5 pr-10 text-xs font-mono text-slate-900 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showAdminPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Demo Key: admin123</span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-metallic-primary h-10 px-5 rounded-lg text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Authenticating..." : "Authorize Admin Session"}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-60" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Staff Login Portal Form */
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
            <span>Standard Clearance (Plain-English incident bulletin & awareness feed)</span>
            <button
              type="button"
              onClick={() => {
                setStaffUsername("staff@secops.local");
                setStaffPassword("staff123");
                setError(null);
              }}
              className="font-mono text-[11px] text-emerald-700 hover:underline cursor-pointer font-medium"
            >
              Fill Demo Staff
            </button>
          </div>

          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-700">
                STAFF IDENTIFIER / EMAIL
              </label>
              <input
                type="text"
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
                className="w-full rounded-lg bg-slate-50/70 px-4 py-2.5 text-xs font-mono text-slate-900 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                placeholder="staff@secops.local"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-700">
                SECURITY PASSKEY
              </label>
              <div className="relative">
                <input
                  type={showStaffPass ? "text" : "password"}
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-50/70 px-4 py-2.5 pr-10 text-xs font-mono text-slate-900 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowStaffPass(!showStaffPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  {showStaffPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Demo Key: staff123</span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-metallic-primary h-10 px-5 rounded-lg text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Authenticating..." : "Authorize Staff Session"}</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-60" />
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
