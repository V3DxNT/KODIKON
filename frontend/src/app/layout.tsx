import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { Footer } from "@/components/Footer";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Redaction+35:ital,wght@0,400;0,700;1,400&display=swap"
        />
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
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
