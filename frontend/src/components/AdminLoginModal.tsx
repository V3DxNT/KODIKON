"use client";

import React, { useState } from "react";
import { Lock, Shield, KeyRound, AlertCircle, X, ArrowRight, CheckCircle2 } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState("admin@secops.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    setTimeout(() => {
      if (password.trim() === "admin123" || username.includes("admin")) {
        setIsAuthenticating(false);
        onLoginSuccess();
        onClose();
      } else {
        setIsAuthenticating(false);
        setError("Invalid security credentials. Use demo password 'admin123'.");
      }
    }, 600);
  };

  const handleFillDemo = () => {
    setUsername("admin@secops.local");
    setPassword("admin123");
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md metallic-surface rounded-2xl p-8 border border-white/15 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-md p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/15 text-slate-200">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              ELEVATED PRIVILEGES
            </div>
            <h3 className="text-lg font-medium text-white">
              Security Administrator Login
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Access to firewall enforcement (<code>sudo ufw deny</code>) and MITRE adversary verification requires authenticated administrative clearance.
        </p>

        {error && (
          <div className="rounded-lg bg-rose-500/10 p-3 border border-rose-500/20 text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>ADMINISTRATOR IDENTITY</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Auto-Fill Demo
              </button>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg bg-black/60 px-3.5 py-2.5 text-xs font-mono text-white border border-white/10 focus:border-white/30 focus:outline-none"
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
              className="w-full rounded-lg bg-black/60 px-3.5 py-2.5 text-xs font-mono text-white border border-white/10 focus:border-white/30 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">Demo Key: admin123</span>
            <button
              type="submit"
              disabled={isAuthenticating}
              className="btn-metallic-primary rounded-lg px-5 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isAuthenticating ? "Verifying..." : "Authenticate"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
