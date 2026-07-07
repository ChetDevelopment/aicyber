"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Lock, User, Shield, BookOpen, Terminal, Target,
  Code, Globe, Award, TrendingUp, Send, Bot,
  Briefcase, FileText, Mic, Paperclip, Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

const TOPICS = [
  "Web Security", "Network Security", "Malware Analysis", "Cryptography",
  "Social Engineering", "Penetration Testing", "Incident Response", "OSINT",
  "Cloud Security", "Mobile Security", "IoT Security", "AI Security",
];

const SKILLS: Skill[] = [
  { name: "XSS", level: 70, category: "Web Security" },
  { name: "SQL Injection", level: 60, category: "Web Security" },
  { name: "Firewalls", level: 75, category: "Network Security" },
  { name: "Phishing", level: 85, category: "Social Engineering" },
  { name: "Encryption", level: 55, category: "Cryptography" },
  { name: "Password Security", level: 90, category: "Web Security" },
];

const OWNER_SYSTEM_PROMPT = `You are CyberAI Tutor speaking directly to your owner and creator, Vichet Sat. You know who he is — the founder who grew up at Passerelles Numeriques Cambodia and built the AIVerse ecosystem.

Your role with the owner:
- You are his personal AI assistant and cybersecurity co-pilot
- You help him develop skills, prepare for interviews, review code, and brainstorm ideas
- You track his progress across cybersecurity topics and suggest next steps
- You provide honest, direct feedback — no fluff, just substance
- You help him prepare for job interviews by simulating real interviews
- You review CVs, cover letters, and job descriptions
- You suggest improvements to the CyberAI Tutor platform itself

Tone: Professional but warm. Be direct and useful. Use Khmer words or phrases occasionally if natural.

Capabilities:
- Interview prep: Ask for a job description, then simulate a realistic interview
- Skill tracking: Suggest next topics based on current skill levels
- Code review: Analyze code snippets for security issues
- Career advice: Discuss cybersecurity career paths and certifications
- Platform ideas: Brainstorm new features for CyberAI Tutor`;

const MODES = [
  { id: "tutor", icon: Bot, label: "Learn" },
  { id: "interview", icon: Briefcase, label: "Interview" },
  { id: "review", icon: FileText, label: "CV Review" },
  { id: "code", icon: Code, label: "Code Review" },
];

export default function OwnerPage() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("tutor");
  const [activeTab, setActiveTab] = useState<"chat" | "progress" | "skills">("chat");
  const chatEnd = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/admin/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "" }),
    }).then(r => {
      if (r.ok) setAuthed(true);
      setAuthLoading(false);
    }).catch(() => setAuthLoading(false));
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) { setAuthed(true); setAuthError(false); }
      else setAuthError(true);
    } catch { setAuthError(true); }
  };

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const modePrompt = mode === "interview"
        ? "You are simulating a job interview. Ask the owner relevant interview questions based on the job description they provide. Give feedback on their answers."
        : mode === "review"
        ? "You are reviewing a CV or cover letter. Ask the owner to paste their CV/job description, then provide detailed feedback."
        : mode === "code"
        ? "You are reviewing code for security issues. Ask the owner to share code, then analyze it for vulnerabilities."
        : OWNER_SYSTEM_PROMPT;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history, model: "gemini-2.0-flash", persona: mode }),
      });
      const data = await res.json();
      const reply = data.reply || "I'm not sure how to answer that.";
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: "Sorry, hit an error." }]);
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Owner Access</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter the admin password to access your personal dashboard.</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Admin password" autoFocus
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-3"
          />
          {authError && <p className="text-sm text-destructive mb-3">Wrong password.</p>}
          <Button onClick={handleLogin} className="w-full h-12 rounded-xl">Unlock</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">Owner Dashboard</span>
          <Badge variant="secondary" className="text-[10px]">Private</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Award className="h-3.5 w-3.5 text-primary" />
            <span>{SKILLS.reduce((a, s) => a + s.level, 0) / SKILLS.length}% Mastery</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Dashboard */}
        <aside className="w-72 border-r border-border bg-background flex flex-col shrink-0 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["chat", "progress", "skills"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-medium transition-colors ${
                  activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "chat" ? "Chat" : tab === "progress" ? "Progress" : "Skills"}
              </button>
            ))}
          </div>

          {activeTab === "skills" && (
            <div className="p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skill Levels</h3>
              {SKILLS.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-muted-foreground">{s.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topics Covered</h3>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map(t => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Suggested Next</h3>
                {["Zero-Day Exploits", "Threat Hunting", "DFIR", "Bug Bounty"].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mode</h3>
              <div className="space-y-1">
                {MODES.map(m => {
                  const Icon = m.icon;
                  return (
                    <button key={m.id} onClick={() => setMode(m.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all ${
                        mode === m.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {m.label}
                    </button>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</h3>
                <button onClick={() => setInput("Suggest a learning roadmap for me based on my current skills")}
                  className="w-full text-left text-xs text-muted-foreground hover:text-foreground py-1.5"
                >
                  📋 Learning Roadmap
                </button>
                <button onClick={() => { setMode("interview"); setInput("I want to practice for a SOC Analyst interview"); }}
                  className="w-full text-left text-xs text-muted-foreground hover:text-foreground py-1.5"
                >
                  🎯 Mock Interview
                </button>
                <button onClick={() => { setMode("review"); setInput("I want to review my CV for a cybersecurity role"); }}
                  className="w-full text-left text-xs text-muted-foreground hover:text-foreground py-1.5"
                >
                  📄 CV Review
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-3xl space-y-5">
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full py-20"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold mb-1">Welcome, Owner</h2>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Your personal AI assistant. Ask me anything — learning, interviews, code review, or platform ideas.
                  </p>
                </motion.div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary mt-0.5">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-xl rounded-tr-sm"
                        : "bg-secondary text-secondary-foreground border border-border rounded-xl rounded-tl-sm"
                    }`}>{msg.text}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}

              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3 items-start">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="rounded-xl border border-border bg-secondary px-4 py-3">
                      <span className="inline-flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEnd} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background/80 backdrop-blur-xl px-6 py-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-end gap-2 rounded-xl border border-input bg-accent/30 px-3.5 py-2 focus-within:border-ring/50 transition-all">
                <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={mode === "interview" ? "Paste a job description or start the interview..." : mode === "review" ? "Paste your CV or cover letter..." : "Ask anything..."}
                  disabled={loading} rows={1}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none max-h-[120px] disabled:opacity-40"
                />
                <button onClick={sendMessage} disabled={loading || !input.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
