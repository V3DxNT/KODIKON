import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationWrapper } from "@/components/NavigationWrapper";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project X — Autonomous Single-Box SOC",
  description: "Autonomous Security Operations Center for small enterprises. Ingests Linux logs, correlates attacks, explains threats in plain English, and proves containment via MITRE Caldera.",
  icons: {
    icon: [
      { url: "/cybersecurity.png", type: "image/png" },
    ],
    shortcut: "/cybersecurity.png",
    apple: "/cybersecurity.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          id="project-x-theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('project_x_theme') || 'dark';
                  var resolved = stored;
                  if (stored === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  var root = document.documentElement;
                  root.classList.remove('dark', 'light');
                  root.classList.add(resolved);
                  root.setAttribute('data-theme', resolved);
                  root.style.colorScheme = resolved;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased flex flex-col font-sans selection:bg-cyan-500/20 relative overflow-x-hidden">
        <div aria-hidden="true" className="px-mesh-aurora" />
        <ThemeProvider>
          <AuthProvider>
            <NavigationWrapper />
            <main className="flex-1 relative z-10">{children}</main>
            <footer className="w-full hairline-t bg-[var(--bg-footer)] py-8 text-center text-xs text-slate-500 font-mono transition-colors">
              <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span>Project X &bull; Single-Box SOC Console V2.0</span>
                <span>MITRE ATT&CK T1110 &bull; T1136 &bull; T1041 &bull; Caldera Verified</span>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
