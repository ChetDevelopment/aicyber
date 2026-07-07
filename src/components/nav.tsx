"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

const PAGE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Chat" },
  { href: "/about", label: "About" },
];

const SCROLL_LINKS = ["Features", "Pricing", "FAQ"];
const TOOL_LINKS = [
  { href: "/tools/password-checker", label: "Password Checker" },
  { href: "/challenges", label: "CTF" },
  { href: "/sandbox", label: "Sandbox" },
  { href: "/dark-web", label: "Dark Web" },
];

export function Nav() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useUser();
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

  if (pathname === "/chat") return null;

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  const isHome = pathname === "/";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background/50 backdrop-blur-sm"
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">CyberAI Tutor</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {PAGE_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                pathname === item.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          {isHome && (
            <>
              <span className="h-4 w-px bg-border" />
              {SCROLL_LINKS.map(item => (
                <button key={item} onClick={() => scrollTo(item)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </button>
              ))}
            </>
          )}
          {!isHome && (
            <>
              <span className="h-4 w-px bg-border" />
              {TOOL_LINKS.map(item => (
                <Link key={item.href} href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            )}
          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-xs text-muted-foreground max-w-[100px] truncate">{user.name || user.email}</span>
              <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
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
          <Link href="/chat">
            <Button>Start Learning</Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 space-y-3 md:hidden">
          {PAGE_LINKS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block text-sm transition-colors",
                pathname === item.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          {isHome && (
            <div className="pt-2 border-t border-border space-y-2">
              {SCROLL_LINKS.map(item => (
                <button key={item} onClick={() => { scrollTo(item); setMobileOpen(false); }}
                  className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
          <div className="pt-2 border-t border-border">
            {loading ? null : user ? (
              <button onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/")}
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
