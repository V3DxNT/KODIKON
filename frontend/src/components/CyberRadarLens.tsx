"use client";

import React, { useEffect, useRef, useState } from "react";
import { Glass } from "./Glass";
import { Shield, Radio, Activity, Terminal, Crosshair, Lock, AlertTriangle } from "lucide-react";

export function CyberRadarLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const [activeVector, setActiveVector] = useState<string>("T1110 (SSH Brute Force)");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const area = containerRef.current;
    const lens = lensRef.current;
    if (!area || !lens) return;

    const state = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let dragging = false;
    let interacted = false;
    let raf = 0;
    let last = 0;
    let t0 = 0;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const initPos = () => {
      const rect = area.getBoundingClientRect();
      state.tx = rect.width * 0.5;
      state.ty = rect.height * 0.5;
      if (!state.x) {
        state.x = state.tx;
        state.y = state.ty;
      }
    };

    initPos();

    const loop = (now: number) => {
      raf = 0;
      const dt = Math.min(0.032, last ? (now - last) / 1000 : 0.016);
      last = now;
      const rect = area.getBoundingClientRect();

      if (!interacted && !reducedMotion) {
        t0 += dt;
        state.tx = rect.width * (0.5 + 0.32 * Math.sin(t0 * 0.7));
        state.ty = rect.height * (0.5 + 0.22 * Math.cos(t0 * 1.1));
      }

      const k = 380;
      const c = 32;
      state.vx += (k * (state.tx - state.x) - c * state.vx) * dt;
      state.vy += (k * (state.ty - state.y) - c * state.vy) * dt;
      state.x += state.vx * dt;
      state.y += state.vy * dt;

      const speed = Math.min(1, Math.hypot(state.vx, state.vy) / 1500);
      const ang = Math.atan2(state.vy, state.vx);

      lens.style.transform = `translate3d(${(state.x - lens.offsetWidth / 2).toFixed(1)}px, ${(state.y - lens.offsetHeight / 2).toFixed(1)}px, 0) rotate(${ang}rad) scale(${1 + speed * 0.1}, ${1 - speed * 0.06}) rotate(${-ang}rad)`;

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    const onPointerMove = (e: PointerEvent) => {
      const rect = area.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        interacted = true;
        state.tx = clientX - rect.left;
        state.ty = clientY - rect.top;
      }
    };

    const onPointerDown = () => {
      dragging = true;
      interacted = true;
    };

    const onPointerUp = () => {
      dragging = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    area.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", initPos);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      area.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", initPos);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[480px] md:h-[540px] rounded-3xl overflow-hidden select-none border border-white/10 shadow-2xl bg-gradient-to-b from-[#0a0d14]/90 via-[#07090e]/95 to-[#050609]"
    >
      {/* 3D Cyber Grid & Ambient Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />
      <div
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Target Infrastructure Underneath (Refracted by Liquid Lens) */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>AUTONOMOUS TELEMETRY CORE</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
            <span>PATROL FREQ: 2500ms</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>

        {/* Tactical Nodes Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-auto">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-400">VICTIM VM</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </div>
            <div className="text-base font-bold text-white font-mono">192.168.1.105</div>
            <div className="text-[11px] text-rose-400 font-mono mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> 18 Auth Failures/min
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-400">CORRELATION</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">MITRE T1110</div>
            <div className="text-[11px] text-amber-300 font-mono mt-1">Rule: R-01 Brute Force</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-400">SOC ENGINE</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">CONTAINED</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">UFW Rule Pending</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-zinc-400">CALDERA PROOF</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
            <div className="text-base font-bold text-white font-mono">VERIFIED</div>
            <div className="text-[11px] text-cyan-300 font-mono mt-1">Exit Code: 1 (Blocked)</div>
          </div>
        </div>

        {/* Live Attack Feed Banner */}
        <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span>sshd[4109]: Failed password for root from 192.168.1.200 port 48212 ssh2</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">SHA-256: 062e27c...</span>
        </div>
      </div>

      {/* DRAGGABLE / PATROL SPRING LIQUID GLASS LENS */}
      <Glass
        glassRef={lensRef}
        radius={120}
        bezel={24}
        strength={56}
        className="absolute top-0 left-0 w-56 h-56 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow-2xl flex flex-col items-center justify-center p-4 border border-cyan-400/30"
        style={{
          boxShadow:
            "0 20px 50px -10px rgba(6, 182, 212, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.8), inset 0 -1px 2px rgba(0, 0, 0, 0.6)",
        }}
      >
        <div className="relative z-10 flex flex-col items-center text-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Crosshair className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
          </div>
          <span className="text-[10px] font-mono font-semibold text-cyan-200 tracking-wider">
            OPTIC REFRACTION LENS
          </span>
          <span className="text-[9px] font-mono text-zinc-300/80 mt-0.5">
            {isHovered ? "Drag to scan nodes" : "Patrol active"}
          </span>
          <div className="mt-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-[9px] font-mono text-cyan-300">
            <Activity className="w-2.5 h-2.5 text-cyan-400" />
            <span>DISPERSION: 56px</span>
          </div>
        </div>
      </Glass>
    </div>
  );
}
