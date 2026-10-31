"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { InteractivePipelineDiagram } from "@/components/InteractivePipelineDiagram";
import { CorrelationVisualizer } from "@/components/CorrelationVisualizer";
import { NetworkTopologyDiagram } from "@/components/NetworkTopologyDiagram";
import { HomeLoginSection } from "@/components/HomeLoginSection";
import { PortalDirectorySection } from "@/components/PortalDirectorySection";
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
        const el = document.getElementById("login-portal");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push("/login?redirect=/admin");
        }
      }
    } else {
      router.push("/staff");
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
    <div className="space-y-24 pb-24">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-lg metallic-surface px-5 py-3 text-xs font-mono text-slate-200 border border-white/15 shadow-xl animate-in slide-in-from-bottom-3">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Hero Overview (Immediate visual punch) */}
      <HeroSection
        onEnterPortal={handleEnterPortal}
        onTriggerReplay={handleTriggerReplay}
        isReplaying={isReplaying}
      />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 space-y-24">
        {/* 2. Visual 10-Step Execution Loop Diagram */}
        <div id="loop">
          <InteractivePipelineDiagram />
        </div>

        {/* 3. Visual Correlation: 8 Raw Alerts -> 1 Plain-English Incident */}
        <div id="correlation">
          <CorrelationVisualizer />
        </div>

        {/* 4. Visual 3-Machine Topology & 4 Contracts Diagram */}
        <div id="topology">
          <NetworkTopologyDiagram />
        </div>

        {/* 5. Integrated Login Portal Section */}
        <div id="login-portal">
          <HomeLoginSection />
        </div>

        {/* 6. Modular System Directory Launchpad */}
        <div id="directory">
          <PortalDirectorySection />
        </div>
      </div>
    </div>
  );
}
