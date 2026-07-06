import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Nav } from "@/components/nav";
import { FloatingChatWrapper } from "@/components/floating-chat-wrapper";
import { PwaInstall } from "@/components/pwa-install";
import { ThreatFeed } from "@/components/threat-feed";
import { Footer } from "@/components/footer";
import { VisitorTrack } from "@/components/visitor-track";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberAI Tutor — Learn Cybersecurity with AI",
  description: "An AI-powered chat that teaches cybersecurity to beginners. Learn about passwords, phishing, network security, and more.",
  icons: { icon: "/CyberAI.png" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "CyberAI Tutor",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <AuthProvider>
            <Nav />
            <main>{children}</main>
            <ThreatFeed />
            <FloatingChatWrapper />
            <PwaInstall />
            <VisitorTrack />
          </AuthProvider>
        </ThemeProvider>
        <script dangerouslySetInnerHTML={{
          __html: `if("serviceWorker" in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js")})}`,
        }} />
      </body>
    </html>
  );
}
