"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { InteractivePipelineDiagram } from "@/components/InteractivePipelineDiagram";
import { NetworkTopologyDiagram } from "@/components/NetworkTopologyDiagram";
import { ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { triggerReplaySimulation } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/soc";

export default function HomePage() {
  const router = useRouter();
  const { role } = useAuth();
  const [isReplaying, setIsReplaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEnterPortal = (targetRole: Role) => {
    if (targetRole === "admin") {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/login?redirect=/admin");
      }
    } else {
      if (role === "employee" || role === "admin") {
        router.push("/staff");
      } else {
        router.push("/staff/login?redirect=/staff");
      }
    }
  };

  const handleTriggerReplay = async () => {
    setIsReplaying(true);
    try {
      await triggerReplaySimulation();
      showToast("Attack sequence ingested into daemon!");
      setTimeout(() => {
        router.push("/attacks");
      }, 1000);
    } catch {
      showToast("Simulation trigger failed");
    } finally {
      setIsReplaying(false);
    }
  };

  return (
    <div className="pb-32">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-lg metallic-surface px-5 py-3 text-xs font-mono text-slate-200 border border-white/15 shadow-xl animate-in slide-in-from-bottom-3">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Hero Overview (Immediate visual punch) */}
      <HeroSection
        onTriggerReplay={handleTriggerReplay}
        isReplaying={isReplaying}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 mt-12 sm:mt-16 space-y-24">
        {/* 2. Visual 10-Step Execution Loop Diagram */}
        <div id="pipeline">
          <InteractivePipelineDiagram />
        </div>

        {/* 3. Visual 3-Machine Topology & 4 Contracts Diagram */}
        <div id="topology">
          <NetworkTopologyDiagram />
        </div>

        {/* 5. Minimalist Presentation Launchpad */}
        <div className="metallic-card rounded-3xl p-10 sm:p-14 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left bg-gradient-to-r from-white/[0.02] to-transparent">
          <div className="space-y-2.5 max-w-xl">
            <div className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              SINGLE-BOX SOC ENGINE &bull; REAL-TIME CONSOLE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Ready to inspect live incident response?
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Experience role-gated containment approval, plain-English advisories, and MITRE Caldera re-attack verification.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <button
              onClick={() => handleEnterPortal("admin")}
              className="btn-metallic-primary px-6 py-3.5 rounded-full text-xs font-semibold tracking-wide uppercase flex items-center space-x-2.5 cursor-pointer shadow-lg hover:shadow-cyan-500/20"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Launch Admin Console</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>
            <button
              onClick={() => handleEnterPortal("employee")}
              className="btn-metallic-secondary px-6 py-3.5 rounded-full text-xs font-mono text-[var(--text-primary)] flex items-center space-x-2 cursor-pointer hover:border-white/20"
            >
              <UserCheck className="h-4 w-4 text-slate-400" />
              <span>Staff Advisory Bulletin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
