import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NavigationWrapper } from "@/components/NavigationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project X — Autonomous Single-Box SOC",
  description: "Autonomous Security Operations Center for small enterprises. Ingests Linux logs, correlates attacks, explains threats in plain English, and proves containment via MITRE Caldera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#08090d] text-slate-100 antialiased flex flex-col font-sans selection:bg-white/20 selection:text-white">
        <AuthProvider>
          <NavigationWrapper />
          <div className="flex-1">{children}</div>
          <footer className="w-full hairline-t bg-[#050609] py-8 text-center text-xs text-slate-500 font-mono">
            <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>Project X &bull; Single-Box SOC Console V2.0</span>
              <span>MITRE ATT&CK T1110 &bull; T1136 &bull; T1041 &bull; Caldera Verified</span>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
