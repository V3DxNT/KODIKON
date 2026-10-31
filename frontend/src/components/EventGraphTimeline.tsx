"use client";

import React, { useState } from "react";
import { 
  Network, 
  GitCommit, 
  Terminal, 
  ShieldAlert, 
  UserCheck, 
  Key, 
  UserPlus, 
  Radio, 
  ArrowRight,
  Clock,
  Layers
} from "lucide-react";
import { EventOut, IncidentDetail } from "@/types/soc";

interface EventGraphTimelineProps {
  incident: IncidentDetail;
}

export const EventGraphTimeline: React.FC<EventGraphTimelineProps> = ({ incident }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventOut | null>(incident.events[0] || null);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "ssh_fail":
        return { label: "SSH FAIL", color: "bg-rose-950/80 text-rose-300 border-rose-500/40", icon: Key };
      case "ssh_success":
        return { label: "SSH SUCCESS", color: "bg-amber-950/80 text-amber-300 border-amber-500/40", icon: UserCheck };
      case "user_add":
        return { label: "USER ADD", color: "bg-purple-950/80 text-purple-300 border-purple-500/40", icon: UserPlus };
      case "egress":
        return { label: "EGRESS C2", color: "bg-red-950/80 text-red-300 border-red-500/40", icon: Radio };
      default:
        return { label: type, color: "bg-slate-800 text-slate-300 border-slate-600", icon: Terminal };
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Attack Graph Section */}
      <div className="rounded-2xl glass-panel p-5 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center space-x-2">
              <Network className="h-4 w-4" />
              <span>NetworkX Correlated Graph (8 Events &rarr; 1 Incident)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Graph linking raw log events sharing Attacker IP <span className="font-mono text-cyan-400">{incident.source_ip}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-rose-400"></span>
              <span>Brute Force</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-purple-400"></span>
              <span>Backdoor</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-red-400"></span>
              <span>Exfiltration</span>
            </span>
          </div>
        </div>

        {/* Interactive SVG Node Diagram */}
        <div className="mt-4 relative overflow-x-auto py-6">
          <div className="min-w-[700px] flex items-center justify-between px-6 relative">
            {/* SVG Linking Lines */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <line x1="80" y1="50" x2="350" y2="50" stroke="url(#edgeGrad)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="350" y1="50" x2="620" y2="50" stroke="url(#edgeGrad)" strokeWidth="2" />
            </svg>

            {/* Act 1 Node Group */}
            <div className="z-10 flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-rose-950/80 border border-rose-500/50 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <Key className="h-6 w-6 text-rose-400" />
                <span className="text-[10px] font-mono text-rose-300 mt-0.5">T1110</span>
              </div>
              <span className="text-xs font-bold text-white mt-2">Act 1: Brute Force</span>
              <span className="text-[10px] text-slate-400 font-mono">5 Fails + 1 Success</span>
            </div>

            {/* Incident Root Synthesis Node (Center) */}
            <div className="z-10 flex flex-col items-center">
              <div className="relative h-20 w-20 rounded-2xl bg-cyan-950/90 border-2 border-cyan-400 flex flex-col items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                <span className="animate-ping absolute inset-0 rounded-2xl bg-cyan-400 opacity-20"></span>
                <ShieldAlert className="h-8 w-8 text-cyan-300" />
                <span className="text-[9px] font-mono text-cyan-200 uppercase font-bold">INCIDENT #{incident.id}</span>
              </div>
              <span className="text-xs font-bold text-cyan-300 mt-2">Correlated Attack</span>
              <span className="text-[10px] text-slate-400 font-mono">Severity: {incident.severity.toUpperCase()}</span>
            </div>

            {/* Act 2 & 3 Node Group */}
            <div className="z-10 flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Radio className="h-6 w-6 text-purple-400" />
                <span className="text-[10px] font-mono text-purple-300 mt-0.5">T1136+T1041</span>
              </div>
              <span className="text-xs font-bold text-white mt-2">Act 2 & 3: Backdoor & C2</span>
              <span className="text-[10px] text-slate-400 font-mono">useradd + egress link</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Act Chronological Timeline */}
      <div className="rounded-2xl glass-panel p-5 border border-white/10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2 pb-3 border-b border-white/5">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>Chronological Event Stream ({incident.events.length} Telemetry Points)</span>
        </h4>

        <div className="mt-4 flex flex-col space-y-2">
          {incident.events.map((ev, index) => {
            const badge = getEventBadge(ev.event_type);
            const Icon = badge.icon;
            const isSelected = selectedEvent?.id === ev.id;

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                className={`group flex items-center justify-between rounded-xl p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-800/90 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : "bg-slate-900/50 border-white/5 hover:bg-slate-900/80 hover:border-white/15"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-[11px] font-mono text-slate-400 w-5">#{index + 1}</span>
                  <div className={`p-1.5 rounded-lg border ${badge.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-medium text-white truncate">
                        {ev.user ? `user=${ev.user}` : "system"} &rarr; {ev.host}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5 max-w-md">
                      {ev.raw_line}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-4 font-mono text-[11px] text-slate-400">
                  {new Date(ev.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw Event Telemetry Inspector Drawer */}
      {selectedEvent && (
        <div className="rounded-2xl bg-black/80 p-4 border border-cyan-500/30 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-white/10">
            <span className="text-cyan-300 font-bold">RAW TELEMETRY INSPECTOR: EVENT #{selectedEvent.id}</span>
            <span>{selectedEvent.ts}</span>
          </div>
          <div className="mt-3 text-slate-300 break-all leading-relaxed bg-slate-950 p-3 rounded-lg border border-white/5">
            <span className="text-emerald-400">$ cat /var/log/auth.log | grep {selectedEvent.source_ip}</span>
            <div className="mt-1 text-slate-200">{selectedEvent.raw_line}</div>
          </div>
        </div>
      )}
    </div>
  );
};
