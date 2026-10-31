"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const HomeLoginSection: React.FC = () => {
  const router = useRouter();
  const { role, loginAsAdmin } = useAuth();

  const [activePortal, setActivePortal] = useState<"admin" | "staff">("admin");
  const [username, setUsername] = useState("admin@secops.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      const ok = loginAsAdmin(username, password);
      setIsSubmitting(false);
      if (ok) {
        router.push("/admin");
      } else {
        setError("Invalid credentials. Demo passkey is 'admin123'.");
      }
    }, 500);
  };

  const handleStaffEnter = () => {
    router.push("/staff");
  };

  const handleFillDemo = () => {
    setUsername("admin@secops.local");
    setPassword("admin123");
    setError(null);
  };

  return (
    <section id="login-portal" className="metallic-surface rounded-2xl p-8 sm:p-12 space-y-8 border border-white/[0.08]">
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
        <div className="flex items-center rounded-lg bg-black/40 p-1 border border-white/10 shrink-0">
          <button
            onClick={() => setActivePortal("admin")}
            className={`flex items-center space-x-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activePortal === "admin"
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="h-3 w-3" />
            <span>Admin Portal</span>
          </button>
          <button
            onClick={() => setActivePortal("staff")}
            className={`flex items-center space-x-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
              activePortal === "staff"
                ? "bg-white/10 text-white shadow-sm border border-white/10"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="h-3 w-3" />
            <span>Staff Portal</span>
          </button>
        </div>
      </div>

      {/* Admin Login Portal Form */}
      {activePortal === "admin" ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>Privileged Clearance (Firewall enforcement & Caldera verification)</span>
            <button
              onClick={handleFillDemo}
              className="font-mono text-[11px] text-slate-300 hover:text-white underline cursor-pointer"
            >
              Fill Demo Credentials
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-500/10 p-3.5 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                ADMINISTRATOR IDENTITY
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-black/60 px-4 py-3 text-xs font-mono text-white border border-white/10 focus:border-white/30 focus:outline-none"
                placeholder="admin@secops.local"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">
                SECURITY PASSKEY
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-black/60 px-4 py-3 text-xs font-mono text-white border border-white/10 focus:border-white/30 focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Demo: admin123</span>
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
        /* Staff Portal Direct Access */
        <div className="max-w-xl mx-auto space-y-6 text-center py-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-slate-300">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-medium text-white">
              Employee Security Bulletin Access
            </h4>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Standard non-technical staff access. Review real-time plain-English incident advisories and business impact summaries.
            </p>
          </div>

          <button
            onClick={handleStaffEnter}
            className="btn-metallic-primary rounded-lg px-6 py-3 text-xs font-semibold flex items-center space-x-2 mx-auto cursor-pointer"
          >
            <span>Enter Staff Security Feed</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
