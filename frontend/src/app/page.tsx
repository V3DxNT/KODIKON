"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
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
    <div>
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-lg metallic-surface px-5 py-3 text-xs font-mono text-slate-200 border border-white/15 shadow-xl animate-in slide-in-from-bottom-3">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <HeroSection
        onEnterPortal={handleEnterPortal}
        onTriggerReplay={handleTriggerReplay}
        isReplaying={isReplaying}
      />
    </div>
  );
}
