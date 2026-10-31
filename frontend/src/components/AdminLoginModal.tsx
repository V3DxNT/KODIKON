"use client";

import React, { useState } from "react";
import { AlertCircle, X, ArrowRight } from "lucide-react";
import { SentinelForgeLogo } from "./SentinelForgeLogo";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[var(--bg-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--border-card)] shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5">
          <SentinelForgeLogo variant="symbol" size="md" />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
              SENTINEL FORGE &bull; ELEVATED PRIVILEGES
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Security Administrator Login
            </h3>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Access to firewall enforcement (<code className="font-mono text-rose-500">sudo ufw deny</code>) and MITRE adversary verification requires authenticated administrative clearance.
        </p>

        {error && (
          <div className="rounded-xl bg-rose-500/10 p-3 border border-rose-500/30 text-xs text-rose-500 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--text-primary)] flex items-center justify-between">
              <span>ADMINISTRATOR IDENTITY</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Auto-Fill Demo
              </button>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-[var(--bg-input)] px-4 py-2.5 text-xs font-mono text-[var(--text-primary)] border border-[var(--border-input)] focus:ring-2 focus:ring-cyan-500/40 focus:outline-none"
              placeholder="admin@secops.local"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[var(--text-primary)]">
              SECURITY PASSKEY
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-[var(--bg-input)] px-4 py-2.5 text-xs font-mono text-[var(--text-primary)] border border-[var(--border-input)] focus:ring-2 focus:ring-cyan-500/40 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Demo Key: admin123</span>
            <button
              type="submit"
              disabled={isAuthenticating}
              className="btn-metallic-primary rounded-full px-5 py-2.5 text-xs font-semibold flex items-center space-x-2 cursor-pointer disabled:opacity-50"
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
