"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";

const TOOL_LINKS = [
  { href: "/tools/password-checker", label: "Password Checker" },
  { href: "/challenges", label: "CTF" },
  { href: "/sandbox", label: "Sandbox" },
];

export function Nav() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/chat" || pathname === "/login" || pathname === "/signup") return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background/50 backdrop-blur-sm"
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href={user ? "/chat" : "/login"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">CyberAI Tutor</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {TOOL_LINKS.map(item => (
            <Link key={item.href} href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <Link href="/chat" className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary hover:bg-primary/20 transition-all" title="Go to Chat">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </Link>
              <span className="hidden sm:block text-xs text-muted-foreground max-w-[100px] truncate">{user.name || user.email}</span>
              <button onClick={logout}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 space-y-3 md:hidden">
          {TOOL_LINKS.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            {loading ? null : user ? (
              <button onClick={logout}
                className="block w-full text-left text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Sign out ({user.name || user.email})
              </button>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)}
                className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
