"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { InteractivePipelineDiagram } from "@/components/InteractivePipelineDiagram";
import { NetworkTopologyDiagram } from "@/components/NetworkTopologyDiagram";
import { ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/soc";

export default function HomePage() {
  const router = useRouter();
  const { role } = useAuth();

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

  return (
    <div className="pb-32">

      {/* 1. Hero Overview (Immediate visual punch) */}
      <HeroSection
        onLaunchConsole={() => handleEnterPortal("admin")}
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
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">
              SINGLE-BOX SOC ENGINE • REAL-TIME CONSOLE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Ready to inspect live incident response?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Experience role-gated containment approval, plain-English advisories, and MITRE Caldera re-attack verification.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
            <button
              onClick={() => handleEnterPortal("admin")}
              className="btn-metallic-primary h-10 px-5 rounded-lg text-xs font-semibold flex items-center space-x-2.5 cursor-pointer shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.16)]"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Launch Admin Console</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>
            <button
              onClick={() => handleEnterPortal("employee")}
              className="btn-metallic-secondary h-10 px-5 rounded-lg text-xs font-semibold text-slate-800 flex items-center space-x-2 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <UserCheck className="h-4 w-4 text-slate-500" />
              <span>Staff Advisory Bulletin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
