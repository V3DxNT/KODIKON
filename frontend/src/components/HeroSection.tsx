"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Lock, ChevronDown, ArrowUp } from "lucide-react";
import { Role } from "@/types/soc";
import { Glass } from "./Glass";
import { CyberRadarLens } from "./CyberRadarLens";

interface HeroSectionProps {
  onEnterPortal: (role: Role) => void;
  onTriggerReplay: () => void;
  isReplaying: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onTriggerReplay,
  isReplaying,
}) => {
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    const target = ctaContainerRef.current;
    if (!target) return;

    // Lightweight IntersectionObserver to trigger smooth floating CTA when hero buttons scroll out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingCta(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-60px 0px 0px 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative pt-8 sm:pt-14 pb-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Institutional Telemetry Pill */}
        <div className="flex items-center space-x-3 text-xs font-mono text-[var(--text-muted)] mb-6">
          <Glass radius={9999} bezel={12} strength={24} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-subtle)] text-[11px] shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="tracking-widest uppercase font-semibold text-emerald-500 dark:text-emerald-400">
              SINGLE-BOX SOC FOR LINUX SERVERS
            </span>
            <span className="text-[var(--text-muted)]">&bull;</span>
            <span className="text-[var(--text-secondary)]">MITRE Caldera Verification</span>
          </Glass>
        </div>

        {/* Hero Grid: Title Left + 2D Cyber Matrix Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.12]">
              Autonomous Server Defense with{" "}
              <span className="font-redaction italic font-normal tracking-wide text-cyan-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-400">
                Mathematical Proof
              </span>
              .
            </h1>

            {/* Liquid Glass Autonomous Loop Strip */}
            <Glass
              radius={16}
              bezel={14}
              strength={28}
              className="rounded-2xl p-4 border border-[var(--border-subtle)] flex flex-wrap items-center gap-2 text-xs font-mono shadow-sm"
            >
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">THE LOOP:</span>
              <span className="text-[var(--text-primary)] font-medium">Detect Attack</span>
              <span className="text-[var(--text-muted)]">&rarr;</span>
              <span className="text-[var(--text-primary)] font-medium">Plain English LLM</span>
              <span className="text-[var(--text-muted)]">&rarr;</span>
              <span className="text-[var(--text-primary)] font-medium">Human Approval</span>
              <span className="text-[var(--text-muted)]">&rarr;</span>
              <span className="text-[var(--text-primary)] font-medium">SSH Firewall Block</span>
              <span className="text-[var(--text-muted)]">&rarr;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Caldera Re-Run Proof</span>
            </Glass>

            <p className="text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl font-normal">
              Project X monitors Linux servers, intercepts brute-force and backdoor intrusions from raw kernel logs, 
              explains threats in plain English for operational clarity, gates responses behind human authorization, 
              and uniquely re-executes MITRE ATT&CK adversary profiles to mathematically prove the block held.
            </p>

            {/* Primary Action CTAs (Target of Scroll-Aware IntersectionObserver) */}
            <div ref={ctaContainerRef} className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo("login-portal")}
                className="btn-metallic-primary flex items-center space-x-2.5 rounded-full px-6 py-3.5 text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/20"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In to Portal</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-70" />
              </button>

              <button
                onClick={() => scrollTo("topology")}
                className="btn-metallic-secondary flex items-center space-x-2 rounded-full px-5 py-3.5 text-xs font-medium tracking-wide transition-all cursor-pointer"
              >
                <span>Explore Architecture</span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              </button>

              <button
                onClick={onTriggerReplay}
                disabled={isReplaying}
                className="btn-metallic-secondary flex items-center space-x-2 rounded-full px-5 py-3.5 text-xs font-mono text-[var(--text-primary)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className={`h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400 ${isReplaying ? "animate-spin" : ""}`} />
                <span>{isReplaying ? "Simulating Attack..." : "Simulate Inbound Threat"}</span>
              </button>
            </div>
          </div>

          {/* Clean 2D Cyber Perimeter Telemetry Stage (Optic Lens Removed) */}
          <div className="lg:col-span-5">
            <CyberRadarLens />
          </div>
        </div>

        {/* 3 Core Value Metric Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="metallic-card rounded-2xl p-6 space-y-2 border border-[var(--border-card)] hover:border-cyan-400/40 transition-all">
            <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase font-bold tracking-wider">
              COST STRUCTURE
            </div>
            <div className="text-2xl font-mono font-medium text-[var(--text-primary)]">
              $0 Software Cost
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Uses permissively licensed MITRE Caldera (Apache 2.0) and lightweight autonomous Python orchestration.
            </p>
          </div>

          <div className="metallic-card rounded-2xl p-6 space-y-2 border border-[var(--border-card)] hover:border-cyan-400/40 transition-all border-t-cyan-500/40">
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
              OPERATIONAL VELOCITY
            </div>
            <div className="text-2xl font-mono font-medium text-[var(--text-primary)]">
              &lt; 45s Mean Quarantine
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              From raw log hit to verified firewall quarantine, gated by a 1-click dual-custody human response gate.
            </p>
          </div>

          <div className="metallic-card rounded-2xl p-6 space-y-2 border border-[var(--border-card)] hover:border-cyan-400/40 transition-all">
            <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase font-bold tracking-wider">
              NON-REPUDIATION
            </div>
            <div className="text-2xl font-mono font-medium text-[var(--text-primary)]">
              Mathematical Proof
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Does not guess whether firewall rules succeeded; actively re-emulates the attack to prove isolation.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Scroll-Aware Docked CTA (Appears smoothly when hero buttons scroll past) */}
      <div
        aria-hidden={!showFloatingCta}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 pointer-events-none ${
          showFloatingCta
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="pointer-events-auto flex items-center space-x-2 px-3 py-2 rounded-full bg-[var(--bg-surface)]/95 border border-[var(--border-card)] shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => scrollTo("login-portal")}
            className="btn-metallic-primary flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            <Lock className="h-3 w-3" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onTriggerReplay}
            disabled={isReplaying}
            className="btn-metallic-secondary flex items-center space-x-1.5 px-3.5 py-2 text-xs font-mono cursor-pointer disabled:opacity-50"
          >
            <Play className={`h-3 w-3 text-cyan-400 ${isReplaying ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isReplaying ? "Simulating..." : "Simulate Threat"}</span>
            <span className="sm:hidden">Simulate</span>
          </button>

          <button
            onClick={scrollToTop}
            title="Scroll to top"
            className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
