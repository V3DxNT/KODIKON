"use client";

import React, { useState } from "react";
import {
  Network,
  Target,
  MessageSquare,
  User,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Star,
  MoreVertical,
  Home,
  FileText,
  FlaskConical,
  Database,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import { SentinelForgeLogo } from "./SentinelForgeLogo";

interface HeroSectionProps {
  onLaunchConsole: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchConsole,
}) => {
  const [mockApproved, setMockApproved] = useState(false);

  return (
    <div className="relative pt-6 sm:pt-10 pb-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ===================================================================
              LEFT COLUMN: Headline, Value Proposition, Actions & 5-Step Cards
              =================================================================== */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Autonomous Server<br />
              Defense with<br />
              <span className="redaction-35-regular-italic font-normal italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600">
                Mathematical Proof
              </span>
              <span className="text-slate-900">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
              Detects brute-force and backdoor intrusions from Linux kernel logs, explains threats in plain English, gates responses behind human approval, and re-runs the attack via MITRE Caldera to prove the block held.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={onLaunchConsole}
                className="btn-metallic-primary h-11 px-5 rounded-lg text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-all shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.16)]"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Launch Threat Console</span>
              </button>
              <a
                href="#pipeline"
                className="btn-metallic-secondary h-11 px-5 rounded-lg text-xs font-semibold text-slate-800 flex items-center space-x-2 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <Network className="h-4 w-4 text-slate-500" />
                <span>View Architecture</span>
              </a>
            </div>

            {/* 5-Step Workflow Cards Row */}
            <div className="pt-4">
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2">
                {/* 1. Detect Attack */}
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-[76px] h-[76px] shrink-0 text-center">
                  <Target className="h-5 w-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-800 leading-tight">
                    Detect<br />Attack
                  </span>
                </div>

                <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />

                {/* 2. Plain-English LLM */}
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-[76px] h-[76px] shrink-0 text-center">
                  <MessageSquare className="h-5 w-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-800 leading-tight">
                    Plain-English<br />LLM
                  </span>
                </div>

                <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />

                {/* 3. Human Approval */}
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-[76px] h-[76px] shrink-0 text-center">
                  <User className="h-5 w-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-800 leading-tight">
                    Human<br />Approval
                  </span>
                </div>

                <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />

                {/* 4. SSH Firewall Block */}
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-[76px] h-[76px] shrink-0 text-center">
                  <LayoutGrid className="h-5 w-5 text-blue-600 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-800 leading-tight">
                    SSH<br />Firewall Block
                  </span>
                </div>

                <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />

                {/* 5. Caldera Re-Run Proof */}
                <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-[76px] h-[76px] shrink-0 text-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-800 leading-tight">
                    Caldera<br />Re-Run Proof
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: Pixel-Perfect macOS Browser Mockup (Sentinel Forge - SOC)
              =================================================================== */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl lg:rounded-3xl bg-white border border-slate-200/90 shadow-[0_16px_50px_rgba(15,23,42,0.08)] overflow-hidden text-left">
              {/* Browser Chrome: Window Controls & Active Tab */}
              <div className="bg-[#f1f3f5] px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Traffic lights */}
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></span>
                  </div>
                  {/* Active Tab */}
                  <div className="flex items-center bg-white px-3 py-1 rounded-t-md border-t border-x border-slate-200/80 text-[10px] font-medium text-slate-700 space-x-1.5 shadow-2xs">
                    <SentinelForgeLogo variant="symbol" size="xs" />
                    <span>Sentinel Forge - SOC</span>
                    <span className="text-slate-400 hover:text-slate-600 cursor-pointer ml-1 text-xs">×</span>
                  </div>
                  <span className="text-slate-400 text-xs cursor-pointer font-light">+</span>
                </div>
              </div>

              {/* Browser Chrome: Address Bar & Navigation */}
              <div className="bg-white px-3.5 py-1.5 border-b border-slate-200/80 flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <ArrowLeft className="h-3 w-3 cursor-pointer hover:text-slate-600" />
                  <ArrowRight className="h-3 w-3 cursor-pointer hover:text-slate-600" />
                  <RotateCw className="h-2.5 w-2.5 cursor-pointer hover:text-slate-600" />
                </div>
                <div className="flex-1 rounded-md bg-slate-100/90 px-3 py-1 flex items-center justify-between text-[11px] font-mono text-slate-600 border border-slate-200/50">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-400 text-[10px]">🔒</span>
                    <span className="text-slate-700 font-medium">localhost:3000/overview</span>
                  </div>
                  <Star className="h-3 w-3 text-slate-400" />
                </div>
                <MoreVertical className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
              </div>

              {/* Inner Web Application Mockup */}
              <div className="flex bg-[#f8fafc]">
                {/* Mini Left Sidebar */}
                <div className="w-36 sm:w-40 p-3.5 border-r border-slate-200/80 bg-white/70 space-y-4 hidden sm:block shrink-0">
                  <div className="flex items-center space-x-2">
                    <SentinelForgeLogo variant="symbol" size="xs" />
                    <div>
                      <div className="text-[10px] font-bold text-slate-900 tracking-tight leading-none">SENTINEL FORGE</div>
                      <div className="text-[7px] font-mono uppercase text-blue-600 tracking-wider font-semibold">AUTONOMOUS SOC</div>
                    </div>
                  </div>

                  <nav className="space-y-1">
                    <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-[11px]">
                      <Home className="h-3.5 w-3.5" />
                      <span>Overview</span>
                    </div>
                    <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-medium text-[11px]">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Incidents</span>
                    </div>
                    <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-medium text-[11px]">
                      <FlaskConical className="h-3.5 w-3.5" />
                      <span>Attack Lab</span>
                    </div>
                    <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-medium text-[11px]">
                      <Database className="h-3.5 w-3.5" />
                      <span>Audit Ledger</span>
                    </div>
                  </nav>
                </div>

                {/* Main Content Dashboard Area */}
                <div className="flex-1 p-3.5 sm:p-4 space-y-3 overflow-hidden">
                  {/* Dashboard Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">Overview</h4>
                      <p className="text-[10px] text-slate-500 font-normal">Live threats, incidents and response status</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-medium text-slate-700 shadow-2xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Daemon Live</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 hidden md:inline">Last updated: Oct 31, 2026, 21:25</span>
                    </div>
                  </div>

                  {/* 1. Recent Incidents (Live) Table */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-900">Recent Incidents (Live)</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[8px] font-mono uppercase text-slate-400 border-b border-slate-100">
                            <th className="pb-1 font-medium">Severity</th>
                            <th className="pb-1 font-medium">Incident</th>
                            <th className="pb-1 font-medium">Source IP</th>
                            <th className="pb-1 font-medium">Detected At</th>
                            <th className="pb-1 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-[9px] divide-y divide-slate-100/70">
                          <tr>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 font-semibold text-[8px] border border-rose-200/60">High</span>
                            </td>
                            <td className="py-1 font-semibold text-slate-900">Brute Force Attempt</td>
                            <td className="py-1 font-mono text-slate-600">192.168.56.20</td>
                            <td className="py-1 text-slate-500 font-mono text-[8px]">Oct 31, 21:07</td>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 font-medium text-[8px] border border-blue-200/60">Detected</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 font-semibold text-[8px] border border-amber-200/60">Medium</span>
                            </td>
                            <td className="py-1 font-semibold text-slate-900">Suspicious Process</td>
                            <td className="py-1 font-mono text-slate-600">192.168.56.11</td>
                            <td className="py-1 text-slate-500 font-mono text-[8px]">Oct 31, 20:54</td>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-600 font-medium text-[8px] border border-sky-200/60">Investigating</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 font-semibold text-[8px] border border-amber-200/60">Medium</span>
                            </td>
                            <td className="py-1 font-semibold text-slate-900">External Access</td>
                            <td className="py-1 font-mono text-slate-600">203.0.113.5</td>
                            <td className="py-1 text-slate-500 font-mono text-[8px]">Oct 31, 20:41</td>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 font-medium text-[8px] border border-purple-200/60">Pending Approval</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[8px] border border-emerald-200/60">Low</span>
                            </td>
                            <td className="py-1 font-semibold text-slate-900">Unusual Login</td>
                            <td className="py-1 font-mono text-slate-600">192.168.56.15</td>
                            <td className="py-1 text-slate-500 font-mono text-[8px]">Oct 31, 20:30</td>
                            <td className="py-1">
                              <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-medium text-[8px] border border-emerald-200/60">Resolved</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. Side-by-Side Cards: Incident Approval & Verification Proof */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Sub-Card 1: Incident Review & Gate */}
                    <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-1.5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-900">Incident: Brute Force Attempt</span>
                          <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 text-[8px] font-bold border border-rose-200/60">High</span>
                        </div>
                        <p className="text-[9px] text-slate-600 leading-relaxed font-normal">
                          Multiple failed SSH login attempts were detected from 192.168.56.20, which matches a brute-force attack pattern. This typically indicates an attempt to guess the server password.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setMockApproved(true)}
                          className={`px-2 py-1 rounded-md text-[9px] font-semibold flex items-center space-x-1 cursor-pointer transition-all ${
                            mockApproved
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" />
                          <span>{mockApproved ? "Blocked ✓" : "Approve block"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setMockApproved(false)}
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-2 py-1 rounded-md text-[9px] font-medium flex items-center space-x-1 cursor-pointer"
                        >
                          <X className="h-2.5 w-2.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Sub-Card 2: Caldera Verification Proof */}
                    <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-2 flex flex-col justify-between">
                      <div className="text-[10px] font-bold text-slate-900">Verification (MITRE Caldera)</div>
                      <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg p-2 flex items-center space-x-2 text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[9px] font-bold">Caldera re-run: attack blocked</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-700 flex items-center justify-between px-1">
                        <span>Attempts before: <strong className="font-bold text-slate-900">47</strong></span>
                        <span className="text-slate-300">|</span>
                        <span>After: <strong className="font-bold text-slate-900">0</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Threat Activity (Last 24 Hours) Area Chart */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-900">Threat Activity (Last 24 Hours)</div>
                    <div className="relative pt-0.5">
                      <svg viewBox="0 0 500 110" className="w-full h-20 sm:h-22 overflow-visible">
                        <defs>
                          <linearGradient id="threatMockGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0071e3" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#0071e3" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        <line x1="25" y1="10" x2="495" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="25" y1="28" x2="495" y2="28" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="25" y1="46" x2="495" y2="46" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="25" y1="64" x2="495" y2="64" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="25" y1="82" x2="495" y2="82" stroke="#f1f5f9" strokeWidth="1" />

                        {/* Y Axis numeric values */}
                        <text x="8" y="13" className="text-[7px] font-mono fill-slate-400">50</text>
                        <text x="8" y="31" className="text-[7px] font-mono fill-slate-400">40</text>
                        <text x="8" y="49" className="text-[7px] font-mono fill-slate-400">30</text>
                        <text x="8" y="67" className="text-[7px] font-mono fill-slate-400">20</text>
                        <text x="8" y="85" className="text-[7px] font-mono fill-slate-400">10</text>
                        <text x="12" y="101" className="text-[7px] font-mono fill-slate-400">0</text>

                        {/* Area Fill matching picture */}
                        <path
                          d="M 25,92 Q 60,96 90,88 T 160,82 T 230,80 T 300,74 T 350,60 T 400,24 T 440,42 T 470,68 T 495,60 L 495,102 L 25,102 Z"
                          fill="url(#threatMockGradient)"
                        />

                        {/* Stroke Line */}
                        <path
                          d="M 25,92 Q 60,96 90,88 T 160,82 T 230,80 T 300,74 T 350,60 T 400,24 T 440,42 T 470,68 T 495,60"
                          fill="none"
                          stroke="#0071e3"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* X Axis Timestamps */}
                      <div className="flex justify-between pl-5 pr-1 pt-0.5 text-[8px] font-mono text-slate-400">
                        <span>00:00</span>
                        <span>03:00</span>
                        <span>06:00</span>
                        <span>09:00</span>
                        <span>12:00</span>
                        <span>15:00</span>
                        <span>18:00</span>
                        <span>21:00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

