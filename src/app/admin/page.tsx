"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
  Sparkles, Shield, Key, Cpu, BarChart3, LogOut, Sun, Moon,
  Check, X, Eye, EyeOff, RefreshCw, MessageSquare, Users, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MODELS = [
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", provider: "gemini" },
  { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite", provider: "gemini" },
  { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash", provider: "gemini" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Groq)", provider: "groq" },
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [checking, setChecking] = useState(true);
  const [keys, setKeys] = useState({ gemini: false, groq: false });
  const [tab, setTab] = useState<"dashboard" | "models" | "keys">("dashboard");
  const [enabledModels, setEnabledModels] = useState<string[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const stored = localStorage.getItem("cyberai_admin_models");
    if (stored) {
      try { setEnabledModels(JSON.parse(stored)); } catch { setEnabledModels(MODELS.map(m => m.id)); }
    } else {
      setEnabledModels(MODELS.map(m => m.id));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cyberai_admin_models", JSON.stringify(enabledModels));
  }, [enabledModels]);

  useEffect(() => {
    const session = sessionStorage.getItem("cyberai_admin");
    const savedPassword = sessionStorage.getItem("cyberai_admin_pw");
    if (session === "true" && savedPassword) {
      setPassword(savedPassword);
      setLoggedIn(true);
      fetchKeys(savedPassword);
    }
    setChecking(false);
  }, []);

  const fetchKeys = async (pw?: string) => {
    try {
      const res = await fetch("/api/admin/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw || password }),
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys);
      }
    } catch {}
  };

  const login = async () => {
    setLoginError(false);
    try {
      const res = await fetch("/api/admin/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys);
        setLoggedIn(true);
        sessionStorage.setItem("cyberai_admin", "true");
        sessionStorage.setItem("cyberai_admin_pw", password);
      } else {
        setLoginError(true);
      }
    } catch {
      setLoginError(true);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    sessionStorage.removeItem("cyberai_admin");
    sessionStorage.removeItem("cyberai_admin_pw");
    setPassword("");
  };

  const toggleModel = (id: string) => {
    setEnabledModels(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const getStats = () => {
    try {
      const sessions = JSON.parse(localStorage.getItem("cyberai_sessions") || "[]");
      const totalChats = sessions.length;
      const totalMessages = sessions.reduce((sum: number, s: any) => sum + (s.messages?.length || 0), 0);
      const totalQuestions = sessions.reduce((sum: number, s: any) =>
        sum + (s.messages?.filter((m: any) => m.role === "user").length || 0), 0
      );
      return { totalChats, totalMessages, totalQuestions };
    } catch {
      return { totalChats: 0, totalMessages: 0, totalQuestions: 0 };
    }
  };

  if (checking) return null;

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Admin Login</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to continue.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(false); }}
              onKeyDown={e => { if (e.key === "Enter") login(); }}
              placeholder="Admin password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            {loginError && <p className="mt-2 text-xs text-destructive">Incorrect password.</p>}
            <Button onClick={login} className="mt-4 w-full" disabled={!password}>Login</Button>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Set ADMIN_PASSWORD in your .env file
          </p>
        </motion.div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Admin</span>
            <Badge variant="secondary" className="text-[10px]">Dashboard</Badge>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              >
                {resolvedTheme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
            )}
            <button onClick={logout} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Tabs */}
        <div className="mb-8 flex gap-1 rounded-xl border border-border bg-card p-1">
          {[
            { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
            { id: "models" as const, label: "AI Models", icon: Cpu },
            { id: "keys" as const, label: "API Keys", icon: Key },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  tab === t.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: MessageSquare, label: "Total Chats", value: stats.totalChats, color: "text-blue-500" },
                { icon: Users, label: "Total Messages", value: stats.totalMessages, color: "text-violet-500" },
                { icon: BookOpen, label: "Questions Asked", value: stats.totalQuestions, color: "text-emerald-500" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${s.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current configuration overview.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Gemini API", ok: keys.gemini },
                  { label: "Groq API", ok: keys.groq },
                  { label: "Local AI Engine", ok: true },
                  { label: "Service Worker", ok: typeof navigator !== "undefined" && "serviceWorker" in navigator },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                    <span className="text-sm text-foreground">{s.label}</span>
                    {s.ok
                      ? <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Active</Badge>
                      : <Badge variant="warning" className="gap-1"><X className="h-3 w-3" /> Not set</Badge>
                    }
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground">
              Stats are based on data in your browser (localStorage).
            </div>
          </motion.div>
        )}

        {tab === "models" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Models</CardTitle>
                <CardDescription>Toggle which models appear in the chat selector. Disabled models still work via fallback chain.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {MODELS.map(m => {
                  const enabled = enabledModels.includes(m.id);
                  return (
                    <div key={m.id}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-all ${
                        enabled ? "border-border bg-card" : "border-dashed border-muted-foreground/30 bg-muted/30 opacity-60"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.provider}</p>
                      </div>
                      <button onClick={() => toggleModel(m.id)}
                        className={`relative h-6 w-11 rounded-full transition-all ${
                          enabled ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      >
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          enabled ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {tab === "keys" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Check which AI provider keys are configured in your environment variables. Keys must be set server-side via Vercel dashboard or .env file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Gemini API", key: "GEMINI_API_KEY", value: process.env.NEXT_PUBLIC_GEMINI_KEY || (keys.gemini ? "••••••••" : ""), configured: keys.gemini },
                  { label: "Groq API", key: "GROQ_API_KEY", value: process.env.NEXT_PUBLIC_GROQ_KEY || (keys.groq ? "••••••••" : ""), configured: keys.groq },
                ].map((k, i) => (
                  <div key={i} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{k.label}</span>
                        {k.configured
                          ? <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Configured</Badge>
                          : <Badge variant="warning" className="gap-1"><X className="h-3 w-3" /> Missing</Badge>
                        }
                      </div>
                      {k.configured && (
                        <button onClick={() => setShowKey(showKey === k.key ? null : k.key)}
                          className="text-muted-foreground hover:text-foreground transition-all"
                        >
                          {showKey === k.key ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    <div className="rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground break-all">
                      {k.configured ? (showKey === k.key ? k.value || "Set in Vercel env vars" : "••••••••••••••••") : "Not configured"}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Set <code className="rounded bg-muted px-1 py-0.5 text-[11px]">{k.key}</code> in your Vercel project environment variables.
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
