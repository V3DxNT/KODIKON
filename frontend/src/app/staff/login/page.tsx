"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Lock,
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Info,
  ArrowLeft
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Glass } from "@/components/Glass";
import { SentinelForgeLogo } from "@/components/SentinelForgeLogo";

function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/staff";
  const { loginAsStaff } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter your staff identifier or organization email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your security passkey.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginAsStaff(username, password, rememberMe);
      if (res.success) {
        router.push(redirectPath);
      } else {
        setError(res.error || "Authentication failed. Check your credentials.");
      }
    } catch {
      setError("An unexpected error occurred during clearance check.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("staff@secops.local");
    setPassword("staff123");
    setError(null);
  };

  return (
    <Glass radius={24} blur={24} intensity={0.9} className="mx-auto max-w-md w-full p-8 sm:p-10 shadow-2xl space-y-6">
      {/* Return link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Return to Overview</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center space-x-3.5">
        <SentinelForgeLogo variant="symbol" size="md" />
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>SENTINEL FORGE &bull; STAFF ACCESS</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
            Staff Portal Login
          </h2>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Sign in to view real-time plain-language cybersecurity bulletins, operational advisories, and facility perimeter status.
      </p>

      {/* Demo Credentials Fast-Fill Callout */}
      <div className="rounded-lg bg-white/[0.02] p-3.5 border border-white/[0.06] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-slate-400">
          <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="font-mono text-[11px]">Demo: staff@secops.local</span>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[11px] font-mono text-slate-300 hover:text-white underline cursor-pointer"
        >
          Auto-Fill Credentials
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg bg-rose-500/10 p-3.5 border border-rose-500/20 text-xs text-rose-300 flex items-start space-x-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">
            STAFF IDENTIFIER / EMAIL
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 text-xs font-mono text-[var(--text-primary)] border border-input focus:border-white/30 focus:outline-none transition-colors"
            placeholder="staff@secops.local"
            autoComplete="username"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300">
            SECURITY PASSKEY
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 pr-10 text-xs font-mono text-[var(--text-primary)] border border-input focus:border-white/30 focus:outline-none transition-colors"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-black/40 border border-white/20 text-slate-300 focus:ring-0 cursor-pointer"
            />
            <span>Remember session</span>
          </label>
          <span className="text-[11px] font-mono text-slate-500">Key: staff123</span>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-metallic-primary rounded-full py-3 text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? "Verifying Clearance..." : "Authorize Staff Session"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Alternative Clearance Switcher */}
      <div className="pt-4 hairline-t flex items-center justify-between text-xs text-slate-400">
        <span>Need Privileged Access?</span>
        <Link
          href="/login?redirect=/admin"
          className="text-slate-300 hover:text-white font-medium flex items-center space-x-1"
        >
          <Lock className="h-3 w-3" />
          <span>Admin Login &rarr;</span>
        </Link>
      </div>
    </Glass>
  );
}

export default function StaffLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-xs font-mono text-slate-400">Loading Staff Portal...</div>}>
        <StaffLoginForm />
      </Suspense>
    </div>
  );
}
