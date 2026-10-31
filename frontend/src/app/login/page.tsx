"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Shield, ArrowRight, AlertCircle, KeyRound, CheckCircle2, Terminal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const { loginAsAdmin } = useAuth();

  const [username, setUsername] = useState("admin@secops.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      const success = loginAsAdmin(username, password);
      setIsSubmitting(false);
      if (success) {
        router.push(redirectPath);
      } else {
        setError("Invalid administrator credentials. Demo passkey is 'admin123'.");
      }
    }, 500);
  };

  const handleFillDemo = () => {
    setUsername("admin@secops.local");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="mx-auto max-w-md metallic-surface rounded-2xl p-8 sm:p-10 border border-white/15 shadow-2xl space-y-6">
      <div className="flex items-center space-x-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/15 text-slate-200">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            ELEVATED CLEARANCE
          </div>
          <h2 className="text-xl font-medium text-white">
            Security Admin Login
          </h2>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Authentication grants clearance to execute host firewall modifications (<code>sudo ufw deny</code>) 
        and trigger MITRE Caldera adversary verification.
      </p>

      {error && (
        <div className="rounded-lg bg-rose-500/10 p-3.5 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>ADMIN IDENTITY</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Fill Demo Credentials
            </button>
          </div>
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
          <span className="text-[11px] font-mono text-slate-500">Demo Key: admin123</span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-metallic-primary rounded-lg px-6 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? "Authenticating..." : "Authorize Session"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-xs font-mono text-slate-400">Loading auth portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
