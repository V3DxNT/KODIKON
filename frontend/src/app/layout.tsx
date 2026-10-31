import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavigationWrapper } from "@/components/NavigationWrapper";
import { FooterWrapper } from "@/components/FooterWrapper";

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
  title: "SENTINEL FORGE — Autonomous SOC",
  description: "Autonomous Security Operations Center for Linux servers. Ingests raw logs, correlates attack graphs, explains threats in plain English, and mathematically proves containment via MITRE Caldera.",
  icons: {
    icon: [
      { url: "/sentinel-forge-symbol.svg", type: "image/svg+xml" },
      { url: "/sentinel-forge-icon.png", type: "image/png" },
    ],
    shortcut: "/sentinel-forge-icon.png",
    apple: "/sentinel-forge-icon.png",
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
          href="https://fonts.googleapis.com/css2?family=Redaction+35:ital,wght@0,400;0,700;1,400&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        />
        <Script
          id="project-x-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.setItem('project_x_theme', 'light');
                  var root = document.documentElement;
                  root.classList.remove('dark');
                  root.classList.add('light');
                  root.setAttribute('data-theme', 'light');
                  root.style.colorScheme = 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] antialiased flex flex-col font-sans selection:bg-blue-500/20 relative overflow-x-hidden"
      >
        <div aria-hidden="true" className="px-mesh-aurora" />
        <ThemeProvider>
          <AuthProvider>
            <NavigationWrapper />
            <main className="flex-1 relative z-10">{children}</main>
            <FooterWrapper />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
