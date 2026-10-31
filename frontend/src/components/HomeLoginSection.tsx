"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, Info } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
    <section id="login-portal" className="metallic-surface rounded-2xl p-8 sm:p-12 space-y-8 border border-card shadow-2xl transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 hairline-b gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-slate-400">
            RBAC ACCESS PORTAL
          </div>
          <h3 className="text-xl sm:text-2xl font-medium text-white mt-1">
            Sign In to the Operational Console
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Choose your clearance level: General Staff awareness or Privileged Security Administrator.
          </p>
        </div>

        {/* Portal Switcher Tabs */}
        <div className="flex items-center rounded-lg bg-[var(--bg-card)] p-1 border border-subtle shrink-0">
          <button
            type="button"
            onClick={() => {
              setActivePortal("admin");
              setError(null);
            }}
            className={`flex items-center space-x-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activePortal === "admin"
                ? "bg-active-pill text-active-pill-text shadow-sm border border-subtle"
                : "text-muted-pill hover:text-active-pill-text"
            }`}
          >
            <Lock className="h-3 w-3" />
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
                ? "bg-active-pill text-active-pill-text shadow-sm border border-subtle"
                : "text-muted-pill hover:text-active-pill-text"
            }`}
          >
            <User className="h-3 w-3" />
            <span>Staff Portal</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="rounded-lg bg-rose-500/10 p-3.5 border border-rose-500/20 text-xs text-rose-300 flex items-start space-x-2.5 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Login Portal Form */}
      {activePortal === "admin" ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>Privileged Clearance (Firewall enforcement & Caldera verification)</span>
            <button
              type="button"
              onClick={() => {
                setAdminUsername("admin@secops.local");
                setAdminPassword("admin123");
                setError(null);
              }}
              className="font-mono text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
            >
              Fill Demo Admin
            </button>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                ADMINISTRATOR IDENTITY
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 text-xs font-mono text-[var(--text-primary)] border border-input focus:border-white/30 focus:outline-none transition-colors"
                placeholder="admin@secops.local"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                SECURITY PASSKEY
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 pr-10 text-xs font-mono text-[var(--text-primary)] border border-input focus:border-white/30 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                className="btn-metallic-primary rounded-lg px-6 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Authenticating..." : "Authorize Admin Session"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Staff Login Portal Form */
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>Standard Clearance (Plain-English incident bulletin & awareness feed)</span>
            <button
              type="button"
              onClick={() => {
                setStaffUsername("staff@secops.local");
                setStaffPassword("staff123");
                setError(null);
              }}
              className="font-mono text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
            >
              Fill Demo Staff
            </button>
          </div>

          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                STAFF IDENTIFIER / EMAIL
              </label>
              <input
                type="text"
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
                className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 text-xs font-mono text-[var(--text-primary)] border border-input focus:border-white/30 focus:outline-none transition-colors"
                placeholder="staff@secops.local"
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                SECURITY PASSKEY
              </label>
              <div className="relative">
                <input
                  type={showStaffPass ? "text" : "password"}
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 pr-10 text-xs font-mono text-[var(--text-primary)] border border-input focus:border-white/30 focus:outline-none transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowStaffPass(!showStaffPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
                className="btn-metallic-primary rounded-lg px-6 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? "Authenticating..." : "Authorize Staff Session"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};
