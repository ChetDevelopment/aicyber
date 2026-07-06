import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { Nav } from "@/components/nav";
import { FloatingChatWrapper } from "@/components/floating-chat-wrapper";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberAI Tutor — Learn Cybersecurity with AI",
  description: "An AI-powered chat that teaches cybersecurity to beginners. Learn about passwords, phishing, network security, and more.",
  icons: {
    icon: "/CyberAI.png",
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
            <FloatingChatWrapper />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
