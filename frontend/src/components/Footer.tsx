"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, CheckCircle2 } from "lucide-react";
import { SentinelForgeLogo } from "./SentinelForgeLogo";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[var(--border-hairline)] bg-[var(--bg-footer)] text-[var(--text-secondary)] transition-colors relative z-20">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8">
        {/* Top 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[var(--border-hairline)]">
          {/* Col 1: Brand & Autonomous SOC Statement (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center group" title="SENTINEL FORGE — Autonomous SOC">
              <SentinelForgeLogo variant="horizontal" size="md" />
            </Link>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-md">
              An autonomous, single-box Security Operations Center engineered for Linux servers. 
              Correlates raw journald and auditd events, synthesizes plain-language incident dossiers, 
              enforces dual-custody human containment, and mathematically verifies firewall blocks via MITRE Caldera.
            </p>

            <div className="flex items-center space-x-3 pt-1">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-card)] text-[11px] font-mono text-[var(--text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>DAEMON STATUS: ACTIVE</span>
                <span className="text-[var(--text-muted)]">&bull;</span>
                <span className="text-cyan-400">FASTAPI :8000</span>
              </div>
            </div>
          </div>

          {/* Col 2: Pipeline Architecture (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#loop" className="hover:text-cyan-400 transition-colors">
                  10-Step Execution Loop
                </Link>
              </li>
              <li>
                <Link href="/#correlation" className="hover:text-cyan-400 transition-colors">
                  Correlation Engine (R1-R3)
                </Link>
              </li>
              <li>
                <Link href="/#topology" className="hover:text-cyan-400 transition-colors">
                  3-Machine Host Topology
                </Link>
              </li>
              <li>
                <span className="text-[var(--text-muted)]">Log Shipper (auditd)</span>
              </li>
              <li>
                <span className="text-[var(--text-muted)]">Paramiko SSH Gateway</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Operations & Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/attacks" className="hover:text-cyan-400 transition-colors">
                  Adversary Attack Lab
                </Link>
              </li>
              <li>
                <Link href="/audit" className="hover:text-cyan-400 transition-colors">
                  Cryptographic Audit Ledger
                </Link>
              </li>
              <li>
                <Link href="/login?redirect=/admin" className="hover:text-cyan-400 transition-colors">
                  Security Admin Console
                </Link>
              </li>
              <li>
                <Link href="/staff/login?redirect=/staff" className="hover:text-cyan-400 transition-colors">
                  Staff Advisory Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Protocols & Verification (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              Verification Standards
            </h4>
            <div className="space-y-2 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--text-primary)]">MITRE Caldera v4.2</strong>
                  <br />
                  Adversary profile re-execution proofs.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--text-primary)]">Zero Data Exfiltration</strong>
                  <br />
                  100% on-premise local server isolation.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--text-primary)]">Dual-Custody Gate</strong>
                  <br />
                  Firewall changes require human approval.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK Matrix Alignment Strip */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-hairline)] text-xs font-mono text-[var(--text-muted)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              TACTICAL ALIGNMENT:
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-card)] text-[11px]">
              T1110 &bull; Brute Force
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-card)] text-[11px]">
              T1136 &bull; Create Account
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-card)] text-[11px]">
              T1041 &bull; Exfiltration
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="btn-metallic-secondary flex items-center space-x-1.5 px-3 py-1.5 text-xs rounded-full cursor-pointer hover:text-[var(--text-primary)]"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>

        {/* Bottom Strip: Copyright & System Identity */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <div>
            &copy; 2026 SENTINEL FORGE Autonomous SOC. Engineered for High-Assurance Linux Environments.
          </div>
          <div className="flex items-center space-x-4 text-[11px] font-mono">
            <span>Air-Gapped Ready</span>
            <span>&bull;</span>
            <span>Apache 2.0 / MITRE Licensed Core</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
