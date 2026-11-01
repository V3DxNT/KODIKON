"use client";

import React, { useState } from "react";
import { 
  Network, 
  Terminal, 
  Key, 
  UserCheck, 
  UserPlus, 
  Radio, 
  Clock,
  ShieldAlert
} from "lucide-react";
import { EventOut, IncidentDetail } from "@/types/soc";
import { formatUtcTime } from "@/lib/date-utils";

interface EventGraphTimelineProps {
  incident: IncidentDetail;
}

export const EventGraphTimeline: React.FC<EventGraphTimelineProps> = ({ incident }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventOut | null>(incident.events[0] || null);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "ssh_fail":
        return { label: "SSH FAIL", color: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: Key };
      case "ssh_success":
        return { label: "SSH SUCCESS", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: UserCheck };
      case "user_add":
        return { label: "USER ADD", color: "text-purple-400 bg-purple-500/10 border-purple-500/20", icon: UserPlus };
      case "egress":
        return { label: "EGRESS C2", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: Radio };
      default:
        return { label: type, color: "text-slate-400 bg-white/5 border-white/10", icon: Terminal };
    }
  };

  return (
    <div className="space-y-8">
      {/* Visual Attack Graph Section */}
      <div className="metallic-surface rounded-xl p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 hairline-b gap-3">
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center space-x-2">
              <Network className="h-3.5 w-3.5 text-slate-400" />
              <span>NetworkX Correlated Graph Topology</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Links raw log alerts sharing source entity <span className="font-mono text-slate-200">{incident.source_ip}</span> within 10-minute window.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-500">
            <span>T1110 (Brute Force)</span>
            <span>&bull;</span>
            <span>T1136 (User Creation)</span>
            <span>&bull;</span>
            <span>T1041 (Egress)</span>
          </div>
        </div>

        {/* Clean Formal SVG Diagram */}
        <div className="relative overflow-x-auto py-8">
          <div className="min-w-[650px] flex items-center justify-between px-8 relative">
            {/* Minimalist linking line */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="90" y1="52" x2="330" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="330" y1="52" x2="570" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            </svg>

            {/* Act 1 Node */}
            <div className="z-10 flex flex-col items-center space-y-2">
              <div className="h-16 w-16 rounded-xl metallic-card border border-white/15 flex flex-col items-center justify-center">
                <Key className="h-5 w-5 text-slate-300" />
                <span className="text-[10px] font-mono text-slate-400 mt-1">T1110</span>
              </div>
              <span className="text-xs font-medium text-slate-200">Act 1: Brute Force</span>
              <span className="text-[10px] text-slate-500 font-mono">5 Fails + 1 Success</span>
            </div>

            {/* Root Incident Synthesis Node */}
            <div className="z-10 flex flex-col items-center space-y-2">
              <div className="h-20 w-20 rounded-xl metallic-surface border border-white/30 flex flex-col items-center justify-center shadow-lg">
                <ShieldAlert className="h-6 w-6 text-white" />
                <span className="text-[9px] font-mono text-slate-300 uppercase mt-1 font-bold">INCIDENT #{incident.id}</span>
              </div>
              <span className="text-xs font-semibold text-white">Correlated Incident</span>
              <span className="text-[10px] text-slate-400 font-mono">{incident.severity.toUpperCase()} RISK</span>
            </div>

            {/* Act 2 & 3 Node */}
            <div className="z-10 flex flex-col items-center space-y-2">
              <div className="h-16 w-16 rounded-xl metallic-card border border-white/15 flex flex-col items-center justify-center">
                <Radio className="h-5 w-5 text-slate-300" />
                <span className="text-[10px] font-mono text-slate-400 mt-1">T1136+T1041</span>
              </div>
              <span className="text-xs font-medium text-slate-200">Act 2 & 3: Backdoor & C2</span>
              <span className="text-[10px] text-slate-500 font-mono">Persistence & Exfil</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Event Stream */}
      <div className="metallic-surface rounded-xl p-8 space-y-6">
        <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center space-x-2 pb-4 hairline-b">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>Chronological Log Stream ({incident.events.length} Telemetry Points)</span>
        </h4>

        <div className="space-y-2.5">
          {incident.events.map((ev, index) => {
            const badge = getEventBadge(ev.event_type);
            const Icon = badge.icon;
            const isSelected = selectedEvent?.id === ev.id;

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className={`group flex items-center justify-between rounded-lg p-3.5 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white/[0.08] border-white/25 shadow-sm"
                    : "bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <span className="text-[11px] font-mono text-slate-500 w-5">0{index + 1}</span>
                  <div className={`p-1.5 rounded border ${badge.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-medium text-slate-200 truncate">
                        {ev.user ? `user=${ev.user}` : "system"} &rarr; {ev.host}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5 max-w-lg">
                      {ev.raw_line}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4 font-mono text-[11px] text-slate-500" suppressHydrationWarning>
                  {formatUtcTime(ev.ts)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Event Inspector */}
      {selectedEvent && (
        <div className="terminal-payload-box preserve-dark rounded-xl bg-[#0b0f19] p-5 border border-slate-800 font-mono text-xs space-y-3" data-preserve-color>
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
            <span className="text-slate-300 font-semibold">TELEMETRY LINE INSPECTOR &bull; EVENT #{selectedEvent.id}</span>
            <span suppressHydrationWarning className="text-slate-400">{selectedEvent.ts}</span>
          </div>
          <div className="break-all leading-relaxed bg-[#060911] p-3.5 rounded-lg border border-slate-800" style={{ color: "#f8fafc" }}>
            <span className="text-cyan-400">$ grep -F &quot;{selectedEvent.source_ip}&quot; /var/log/auth.log</span>
            <div className="mt-1 font-mono" style={{ color: "#f8fafc" }}>{selectedEvent.raw_line}</div>
          </div>
        </div>
      )}
    </div>
  );
};
