"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Send, Sparkles, Sun, Moon, Menu, Plus, Trash2, User,
  Shield, Wifi, Lock, Bug, Eye, Key, Globe, Mail,
  BookOpen, FolderKanban, FolderPlus, ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  type: "chat" | "research";
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  createdAt: number;
}

const TOPICS = [
  { id: "passwords", label: "Passwords & Auth", icon: Key },
  { id: "phishing", label: "Phishing & Scams", icon: Mail },
  { id: "network", label: "Network Security", icon: Wifi },
  { id: "web", label: "Web Security", icon: Globe },
  { id: "malware", label: "Malware & Threats", icon: Bug },
  { id: "encryption", label: "Encryption", icon: Lock },
  { id: "social", label: "Social Engineering", icon: Eye },
  { id: "general", label: "General Safety", icon: Shield },
];

const SUGGESTIONS = [
  "What makes a strong password?",
  "How do I recognize phishing emails?",
  "What is two-factor authentication?",
  "How does encryption work?",
  "What is a VPN?",
  "How do I stay safe on public WiFi?",
];

const MODELS = [
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
  { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Groq)" },
];

const STORAGE_KEY = "cyberai_sessions";
const PROJECTS_KEY = "cyberai_projects";
const MODEL_KEY = "cyberai_model";

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash-lite");
  const [mounted, setMounted] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const { user, loading: authLoading } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const chatEnd = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find(s => s.id === activeId) || null;
  const messages = activeSession?.messages || [];

  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setSessions(saved);
      const savedProjects = JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]");
      setProjects(savedProjects);
      const savedModel = localStorage.getItem(MODEL_KEY);
      if (savedModel) setSelectedModel(savedModel);
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(MODEL_KEY, selectedModel); }, [selectedModel]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = Math.min(textRef.current.scrollHeight, 140) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (showNewProject && projectInputRef.current) {
      projectInputRef.current.focus();
    }
  }, [showNewProject]);

  const createSession = useCallback((type: "chat" | "research" = "chat", projectId?: string) => {
    const id = Date.now().toString();
    const label = type === "research" ? "New research" : "New chat";
    setSessions(prev => [{ id, title: label, messages: [], createdAt: Date.now(), type, projectId }, ...prev]);
    setActiveId(id);
    setInput("");
    return id;
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (activeId === id) setActiveId(filtered[0]?.id || null);
      return filtered;
    });
  }, [activeId]);

  const createProject = () => {
    const name = newProjectName.trim();
    if (!name) return;
    const id = Date.now().toString();
    setProjects(prev => [...prev, { id, name, createdAt: Date.now() }]);
    setNewProjectName("");
    setShowNewProject(false);
    setExpandedProjects(prev => new Set(prev).add(id));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setSessions(prev => prev.map(s => s.projectId === id ? { ...s, projectId: undefined } : s));
  };

  const toggleProject = (id: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const sendMessage = async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput("");

    let sessionId = activeId;
    if (!sessionId) sessionId = createSession("chat");
    await new Promise(r => setTimeout(r, 0));

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg };
    const session = sessions.find(s => s.id === sessionId) || { id: sessionId!, title: "New chat", messages: [], createdAt: Date.now(), type: "chat" as const };
    const updatedMessages = [...session.messages, userMsg];
    const title = session.messages.length === 0 ? msg.slice(0, 50) + (msg.length > 50 ? "..." : "") : session.title;

    updateSession(sessionId!, { messages: updatedMessages, title });
    setLoading(true);

    try {
      const history = updatedMessages.slice(0, -1).map(m => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history, model: selectedModel }),
      });
      const data = await res.json();
      const reply = data.reply || "I'm not sure how to answer that. Could you try asking in a different way?";
      updateSession(sessionId!, { messages: [...updatedMessages, { id: (Date.now() + 1).toString(), role: "assistant", text: reply }] });
    } catch {
      updateSession(sessionId!, { messages: [...updatedMessages, { id: (Date.now() + 1).toString(), role: "assistant", text: "Sorry, I hit an error. Please try again." }] });
    }
    setLoading(false);
  };

  const selectTopic = (topicId: string) => {
    const topic = TOPICS.find(t => t.id === topicId);
    if (topic) sendMessage(`Teach me about ${topic.label}`);
  };

  const chatSessions = sessions.filter(s => s.type === "chat" && !s.projectId);
  const researchSessions = sessions.filter(s => s.type === "research");

  if (!user && !authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-primary/20">
            <img src="/CyberAI.png" alt="CyberAI Tutor" className="h-16 w-16 object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">You need to sign in to use the AI tutor.</p>
          <Link href="/login">
            <Button size="lg" className="mt-8 h-12 rounded-xl px-8">
              Sign in
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className={`relative z-20 flex flex-col border-r border-border bg-background transition-all duration-300 shrink-0 ${sidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md overflow-hidden">
              <img src="/CyberAI.png" alt="" className="h-6 w-6 object-cover" />
            </div>
            <span className="text-sm font-semibold">CyberAI</span>
          </div>
          <button onClick={() => createSession("chat")} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all" title="New chat">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin">
          {/* New Chat & New Research */}
          <div className="space-y-1">
            <button onClick={() => createSession("chat")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
            <button onClick={() => createSession("research")}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            >
              <BookOpen className="h-4 w-4" />
              New Research
            </button>
          </div>

          {/* Research Section */}
          {researchSessions.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Research</p>
              <div className="space-y-0.5">
                {researchSessions.map(s => (
                  <div key={s.id} onClick={() => { setActiveId(s.id); setInput(""); }}
                    className={`group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all text-sm ${
                      activeId === s.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    <span className="flex-1 truncate text-xs">{s.title}</span>
                    <button onClick={e => { e.stopPropagation(); deleteSession(s.id); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5 transition-opacity">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between px-3 py-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Projects</p>
              <button onClick={() => setShowNewProject(true)} className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground transition-all">
                <FolderPlus className="h-3.5 w-3.5" />
              </button>
            </div>
            {showNewProject && (
              <div className="px-2 pb-1">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1">
                  <input ref={projectInputRef} value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") createProject(); if (e.key === "Escape") setShowNewProject(false); }}
                    placeholder="Project name..." className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button onClick={createProject} disabled={!newProjectName.trim()} className="text-xs text-primary hover:text-primary/80 disabled:text-muted-foreground transition-all">Add</button>
                </div>
              </div>
            )}
            <div className="space-y-0.5">
              {projects.length === 0 && (
                <p className="px-3 py-2 text-[11px] text-muted-foreground">No projects yet</p>
              )}
              {projects.map(p => {
                const projectChats = sessions.filter(s => s.projectId === p.id);
                const isExpanded = expandedProjects.has(p.id);
                return (
                  <div key={p.id}>
                    <div onClick={() => toggleProject(p.id)}
                      className="group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      <FolderKanban className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      <span className="flex-1 truncate text-xs">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground">{projectChats.length}</span>
                      <button onClick={e => { e.stopPropagation(); deleteProject(p.id); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5 transition-opacity">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="ml-4 space-y-0.5 border-l border-border pl-2">
                        <button onClick={() => createSession("chat", p.id)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                        >
                          <Plus className="h-3 w-3" />
                          New chat in project
                        </button>
                        {projectChats.map(s => (
                          <div key={s.id} onClick={() => { setActiveId(s.id); setInput(""); }}
                            className={`group flex items-center gap-2 rounded-lg px-3 py-1.5 cursor-pointer transition-all text-sm ${
                              activeId === s.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <Sparkles className="h-3 w-3 shrink-0 opacity-50" />
                            <span className="flex-1 truncate text-[11px]">{s.title}</span>
                            <button onClick={e => { e.stopPropagation(); deleteSession(s.id); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5 transition-opacity">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* History Section */}
          {chatSessions.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">History</p>
              <div className="space-y-0.5">
                {chatSessions.map(s => (
                  <div key={s.id} onClick={() => { setActiveId(s.id); setInput(""); }}
                    className={`group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all text-sm ${
                      activeId === s.id ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    <span className="flex-1 truncate text-xs">{s.title}</span>
                    <button onClick={e => { e.stopPropagation(); deleteSession(s.id); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive p-0.5 transition-opacity">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sessions.length === 0 && (
            <div className="py-6 text-center text-xs text-muted-foreground">No conversations yet</div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">CyberAI Tutor</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Beta</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}
                className="appearance-none bg-transparent border border-border rounded-lg px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id} className="bg-background text-foreground">{m.label}</option>
                ))}
              </select>
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-[10px]">▾</span>
            </div>
            <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
              {mounted && (resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
            </button>
            <span className="text-[10px] text-muted-foreground"><span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse" />online</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {!activeSession ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col items-center justify-center px-6">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-1 text-lg font-semibold text-foreground">Learn Cybersecurity with AI</h2>
              <p className="mb-8 max-w-sm text-center text-sm text-muted-foreground">
                Ask any question about cybersecurity — passwords, phishing, encryption, and more.
              </p>
              <div className="flex max-w-lg flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="rounded-lg border border-border px-3.5 py-2 text-xs text-muted-foreground hover:border-primary/30 hover:bg-accent hover:text-foreground transition-all active:scale-[0.97]"
                  >{s}</button>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {TOPICS.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => selectTopic(t.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-[0.97]"
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
              {activeSession.type === "research" && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Research mode — exploring cybersecurity in depth
                </div>
              )}
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                  className={`flex gap-3 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary mt-0.5">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-xl rounded-tr-sm"
                        : "bg-secondary text-secondary-foreground border border-border rounded-xl rounded-tl-sm [&_strong]:font-semibold"
                    }`}>{msg.text}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3 items-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary">
                      <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="rounded-xl rounded-tl-sm border border-border bg-secondary px-4 py-3">
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
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border bg-background/80 backdrop-blur-xl px-4 py-3 shrink-0">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-xl border border-input bg-accent/30 px-3.5 py-2 focus-within:border-ring/50 focus-within:shadow-sm transition-all">
              <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                placeholder="Ask a cybersecurity question..." disabled={loading} rows={1}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none max-h-[140px] disabled:opacity-40 scrollbar-thin"
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all active:scale-[0.97]"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
