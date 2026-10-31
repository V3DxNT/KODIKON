"use client";

import React from "react";
import { usePathname } from "next/navigation";

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();

  // Hide public landing footer in admin portal
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full hairline-t bg-[var(--bg-footer)] py-8 text-center text-xs text-slate-500 font-mono transition-colors">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>Project X &bull; Single-Box SOC Console V2.0</span>
        <span>MITRE ATT&CK T1110 &bull; T1136 &bull; T1041 &bull; Caldera Verified</span>
      </div>
    </footer>
  );
};
