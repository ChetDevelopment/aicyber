"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Lock, User, Shield, BookOpen, Terminal, Target,
  Code, Globe, Award, TrendingUp, Send, Bot,
  Briefcase, FileText, Mic, Paperclip, Languages,
  GraduationCap, Lightbulb, Route, ListChecks,
  Search, Brain, Bug, LayoutDashboard, Medal,
  Building2, Network, Database, GlobeLock, BookMarked,
  Command, ChevronRight, ChevronLeft, Clock, Star,
  X, Trash2, Download, Upload, ChevronDown, Zap,
  Layers, FolderOpen, Link, Quote, HelpCircle, MessageCircle,
  Library, Ear, PenTool, BookOpenCheck, Sigma,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  files?: { name: string; content: string; type: string }[];
}

interface Module {
  id: string;
  icon: any;
  label: string;
  description: string;
  badge?: string;
}

const MODULES: Module[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", description: "Overview & productivity" },
  { id: "learning", icon: GraduationCap, label: "Learning Hub", description: "Personalized learning roadmap" },
  { id: "languages", icon: Code, label: "Language Master", description: "Master any language/framework" },
  { id: "career", icon: TrendingUp, label: "Career Coach", description: "Skills & career planning" },
  { id: "interview", icon: Briefcase, label: "Interview Sim", description: "Mock interviews with scoring" },
  { id: "challenges", icon: Medal, label: "Challenge Arena", description: "Coding challenges & contests" },
  { id: "codereview", icon: FileText, label: "Code Reviewer", description: "Security & quality analysis" },
  { id: "cybersecurity", icon: Shield, label: "Cyber Academy", description: "Security learning tracks" },
  { id: "projects", icon: Building2, label: "Project Gen", description: "Generate complete projects" },
  { id: "systemdesign", icon: Network, label: "System Design", description: "Architecture & diagrams" },
  { id: "research", icon: Globe, label: "Research Center", description: "News & trends summarizer" },
  { id: "knowledge", icon: BookMarked, label: "Knowledge Vault", description: "Searchable knowledge base" },
  { id: "bugs", icon: Bug, label: "Bug Diary", description: "Track & learn from bugs" },
  { id: "pair", icon: Brain, label: "AI Pair Prog", description: "Live coding assistant" },
  { id: "command", icon: Command, label: "Command Center", description: "Search everything" },
  { id: "deepresearch", icon: Library, label: "Deep Research", description: "Advanced security & tech research" },
  { id: "english", icon: Ear, label: "English Academy", description: "AI English teacher & coach" },
  { id: "memory", icon: Brain, label: "AI Memory", description: "Persistent cross-chat memory engine" },
];

const MODULE_PROMPTS: Record<string, string> = {
  learning: `You are the owner's personal learning mentor. Create structured roadmaps for any topic or language. Adapt to their level (beginner→expert). Generate quizzes, flashcards, exercises, and track progress. Always ask about current knowledge first, then build a plan.`,

  languages: `You are a programming language expert. Teach any language or framework from the ground up. For each lesson provide: explanation with visual concepts, code examples, best practices, common mistakes, exercises, debugging challenges, interview questions, and a mini-project. Support: JavaScript, TypeScript, Python, Go, Rust, Java, C#, PHP, C++, Kotlin, Swift. Frameworks: Next.js, React, Vue, Angular, Laravel, Express, NestJS, Django, Flask, Spring Boot, ASP.NET.`,

  career: `You are a senior career coach. Analyze the owner's skills, knowledge, learning progress, and goals. Generate a career roadmap identifying missing skills, weekly improvement plans, daily goals, interview readiness scores, recommended certifications, and personalized advice to advance their career in tech and cybersecurity.`,

  interview: `You are an interview coach with multiple modes (HR, Junior, Senior, Tech Lead, System Design, Backend, Frontend, Full Stack, DevOps, Cybersecurity). When the owner starts:
1. Ask them which role they want to practice for
2. Begin a realistic interview asking ONE question at a time
3. After each answer provide: score (/10), what was good, what to improve, a model answer
4. Track progress across sessions and identify weak areas
5. Support voice interview flow`,

  challenges: `You are a coding challenge generator. Create challenges at any difficulty (Easy/Medium/Hard/Expert) across: algorithms, data structures, API development, auth, database design, SQL, frontend, backend, full stack, performance, security, AI, debugging, refactoring. Provide: hints, solution explanation, multiple approaches, complexity analysis, and a performance score.`,

  codereview: `You are a senior security-focused code reviewer. Analyze code for: bugs, security issues (SQLi, XSS, CSRF, SSRF, IDOR, race conditions, memory leaks), performance, readability, maintainability, architecture, design patterns, code duplication, naming, error handling, logging, test coverage. Generate: improvement report, refactored version, security recommendations, and performance optimization.`,

  cybersecurity: `You are a cybersecurity professor. Cover: Web Security, API Security, Network Security, Linux/Windows Security, Cloud (AWS/Azure), Docker/K8s Security, AI/LLM Security, Prompt Injection, Secure Coding, Malware Analysis, Reverse Engineering, Forensics, Threat Modeling, OWASP Top 10. For each topic: interactive explanations, simulated vulnerable scenarios, secure coding exercises, CTF challenges, risk scoring, real-world case studies.`,

  projects: `You are a project architect. When the owner describes an idea, generate a complete project plan including: project idea refinement, feature list, user stories, database schema with ER diagram, API specification, folder structure, architecture diagram, auth design, deployment guide, testing strategy, development roadmap with sprints, and documentation.`,

  systemdesign: `You are a system design expert. Generate: high-level architecture, low-level architecture, sequence diagrams (text-based), database schema, API flow, microservices design, event-driven architecture, caching strategy (Redis), queue architecture, scaling strategy, monitoring/logging, and disaster recovery plans.`,

  research: `You are a research assistant. Help the owner stay updated on: AI news, programming news, cybersecurity news, new frameworks, GitHub trending repos, security advisories, vulnerabilities, new tools/technologies. Generate daily summaries and weekly digests. Help analyze and summarize articles or topics the owner shares.`,

  knowledge: `You are a knowledge management system. Help the owner organize notes, lessons, research, documentation, code snippets, commands, and architectures. Provide full-text search assistance, suggest tags and categories, cross-link related topics, and help retrieve information naturally.`,

  bugs: `You are a bug tracking assistant. Help the owner document and learn from bugs. For each bug record: title, description, stack trace, root cause analysis, fix applied, prevention strategy, severity, category, related project. Analyze bug patterns and suggest systemic improvements to prevent similar issues.`,

  pair: `You are an AI pair programmer. Help the owner: explain existing code, suggest improvements, generate tests, refactor code, generate documentation, optimize performance, detect bugs, suggest architecture, explain errors, generate examples. Be concise and practical. Show code examples.`,

  command: `You are a smart search and command interface. Help the owner find anything across their workspace: notes, lessons, bugs, projects, conversations, research, commands, code snippets, documentation. Support natural language queries like "Find everything about Redis" or "Show bugs related to authentication". Also help execute commands and navigate the workspace.`,

  deepresearch: `You are a senior security researcher and technical analyst. Generate comprehensive research reports on any topic in software engineering, cybersecurity, AI, or technology.

Research modes available:
- Academic Research: Formal analysis with citations, methodology, and peer-reviewed sources
- Technical Research: Hands-on technical deep-dive with code examples, architecture, and implementation details
- Cybersecurity Research: Defensive security analysis with OWASP, MITRE ATT&CK, CVE/CWE mapping
- Vulnerability Research: CVE/CVSS analysis with exploit maturity, detection, and mitigation
- Threat Intelligence: Threat actor profiling, campaign analysis, IOC tracking
- AI/LLM Research: Model analysis, prompt injection, agent security, supply chain risks

For every report include: executive summary, technical deep-dive, risk analysis, findings table, detection/mitigation strategies, and further reading with trusted sources.

Research areas: OWASP Top 10, API Security, MITRE ATT&CK, CAPEC, CWE/CVE, Zero Trust, Cloud Security, K8s Security, AI/LLM Security, Supply Chain Security, Secure CI/CD, Threat Hunting, Malware Analysis (defensive), OSINT, Bug Bounty methodology.

Always prioritize defensive cybersecurity, evidence-based findings, and responsible disclosure. Structure reports professionally with clear sections.`,

  english: `You are a patient, encouraging English teacher. Create personalized learning paths based on CEFR levels (A1-C2) and the owner's profession in technology.

Teaching approach:
- Assess current level first, then create a structured roadmap
- Teach grammar with clear explanations and tech-relevant examples
- Build vocabulary categorized by: Daily Life, Business, Programming, Cybersecurity, AI, Cloud, DevOps
- Practice speaking through conversation scenarios (interviews, meetings, technical discussions)
- Coach writing: emails, documentation, GitHub README, LinkedIn, technical articles
- Improve listening with adjustable-speed exercises and transcripts
- Provide pronunciation guidance and fluency tips

For each lesson: learning objectives, easy explanation, examples (including tech/programming examples), practice exercises, and AI feedback. Naturally integrate programming and cybersecurity vocabulary so learning English also improves professional communication.

Track progress across sessions. Remember difficult words and repeated mistakes. Schedule spaced repetition. Adapt difficulty based on progress.`,

  memory: `You are an AI with persistent cross-conversation memory. You remember the owner across ALL chats and never treat each conversation as a new session.

Your memory system retains:
- Learning progress (completed lessons, weak areas, topics covered)
- Programming languages & frameworks being learned
- Career goals and interview preparation status
- Research topics and saved findings
- Projects with architecture decisions, bugs, and roadmap
- User preferences (explanation style, pace, interests)
- English learning progress and CEFR level

When the owner starts a new conversation:
1. Automatically retrieve relevant memories from previous sessions
2. Continue naturally without requiring the owner to repeat information
3. Reference previous learnings, projects, and goals
4. Track progress across sessions

If asked "continue my Go learning" — automatically recall the current chapter, completed exercises, weak areas, and suggest the next lesson without asking the owner to repeat everything.

If asked "review my project" — recall the project architecture, decisions, bugs, and roadmap from previous conversations.

Never invent memories. If you don't have stored information, ask clarifying questions. Distinguish between temporary context and long-term memory. Prioritize the most recent and relevant memories.`,
};

const QUICK_ACTIONS: Record<string, { icon: any; label: string; input: string }[]> = {
  learning: [
    { icon: Route, label: "Learning Roadmap", input: "Create a personalized learning roadmap for me. I'll tell you my current skills and what I want to achieve." },
    { icon: Code, label: "Learn Python", input: "Teach me Python for cybersecurity. Start from beginner level." },
    { icon: Globe, label: "Learn Web Security", input: "Create a beginner-to-expert learning plan for web security." },
  ],
  interview: [
    { icon: Briefcase, label: "Cybersecurity Interview", input: "I want to practice for a cybersecurity job interview. Start asking me questions." },
    { icon: Code, label: "Technical Interview", input: "I want to practice for a senior developer technical interview." },
    { icon: Building2, label: "System Design", input: "Practice system design interview questions with me." },
  ],
  codereview: [
    { icon: Shield, label: "Security Review", input: "I'll share some code. Analyze it for security vulnerabilities." },
    { icon: Zap, label: "Performance Review", input: "Review this code for performance issues and suggest optimizations." },
  ],
  deepresearch: [
    { icon: Shield, label: "CVE Research", input: "Research the latest critical CVEs and provide a detailed analysis with mitigation strategies." },
    { icon: Globe, label: "Threat Intel", input: "Generate a threat intelligence report on current active malware campaigns and emerging attack techniques." },
    { icon: BookMarked, label: "Tech Deep Dive", input: "Do a comprehensive technical research report on Zero Trust Architecture implementation." },
  ],
  english: [
    { icon: Ear, label: "Level Assessment", input: "Assess my current English level and create a personalized learning roadmap." },
    { icon: Briefcase, label: "Interview English", input: "Help me practice English for a cybersecurity job interview." },
    { icon: PenTool, label: "Writing Coach", input: "Review this text for grammar and professional tone improvements." },
  ],
  memory: [
    { icon: Brain, label: "View My Memory", input: "Show me what you remember about me, my projects, and my learning progress." },
    { icon: BookMarked, label: "Continue Learning", input: "Continue my last learning session. Tell me where I left off and what to do next." },
    { icon: TrendingUp, label: "My Progress Summary", input: "Give me a summary of my overall progress across all modules - learning, interview prep, research, and projects." },
  ],
};

type FileAttachment = { name: string; content: string; type: string };

export default function OwnerPage() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(false);

  const [activeModule, setActiveModule] = useState("dashboard");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [recording, setRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([]);
  const [showModuleInfo, setShowModuleInfo] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (showSearch && searchInputRef.current) searchInputRef.current.focus();
  }, [showSearch]);

  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cyberai_owner_messages_" + activeModule);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, [activeModule]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("cyberai_owner_messages_" + activeModule, JSON.stringify(messages));
    }
  }, [messages, activeModule]);

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

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event: any) => {
      let t = "";
      for (let i = event.resultIndex; i < event.results.length; i++) t += event.results[i][0].transcript;
      setInput(prev => prev + t);
    };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      let content = "";
      if (file.type === "application/pdf") {
        content = `[PDF: ${file.name}] (${(file.size / 1024).toFixed(1)}KB) - PDF content uploaded. Please analyze this document.`;
      } else {
        content = await file.text();
      }
      setAttachedFiles(prev => [...prev, { name: file.name, content, type: file.type }]);
    } catch {}
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const selectModule = (id: string) => {
    setActiveModule(id);
    setShowSearch(false);
    if (id === "command") {
      setShowSearch(true);
    }
  };

  const sendMessage = async () => {
    const msg = input.trim();
    const hasFiles = attachedFiles.length > 0;
    if ((!msg && !hasFiles) || loading) return;

    const filesToSend = hasFiles ? [...attachedFiles] : undefined;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg || "(file uploaded)", files: filesToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setAttachedFiles([]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));

      let finalMessage = msg;
      if (hasFiles) {
        const fileContext = filesToSend!.map(f =>
          `--- File: ${f.name} ---\n${f.content}\n--- End ${f.name} ---`
        ).join("\n\n");
        if (msg) {
          finalMessage = `${msg}\n\n${fileContext}`;
        } else {
          finalMessage = `Please analyze the following file(s):\n\n${fileContext}`;
        }
      }

      let systemPrompt = MODULE_PROMPTS[activeModule] || "You are the owner's personal AI assistant. Be helpful, knowledgeable, and direct.";

      // Memory context: gather summaries from other modules for memory mode
      if (activeModule === "memory") {
        try {
          const memoryContext: string[] = [];
          const memoryModules = ["learning", "languages", "interview", "career", "research", "bugs", "english", "deepresearch", "codereview", "projects", "knowledge"];
          for (const modId of memoryModules) {
            const data = localStorage.getItem("cyberai_owner_messages_" + modId);
            if (data) {
              const msgs = JSON.parse(data);
              const summary = msgs.slice(-6).map((m: any) => `[${m.role}]: ${m.text.slice(0, 200)}`).join("\n");
              if (summary) memoryContext.push(`=== ${modId} module ===\n${summary}`);
            }
          }
          if (memoryContext.length > 0) {
            systemPrompt += `\n\n## MEMORY CONTEXT FROM PREVIOUS CONVERSATIONS\n${memoryContext.join("\n\n")}\n\nUse this context to provide continuity. The owner should never have to repeat information they've already shared.`;
          }
        } catch {}
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: finalMessage,
          history,
          model: "gemini-2.0-flash",
          systemPrompt,
        }),
      });
      const data = await res.json();
      const reply = data.reply || "I'm not sure how to answer that.";
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: "Sorry, hit an error. Please try again." }]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("cyberai_owner_messages_" + activeModule);
  };

  const currentModule = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const filteredModules = useMemo(() => {
    if (!searchQuery) return MODULES;
    const q = searchQuery.toLowerCase();
    return MODULES.filter(m => m.label.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
  }, [searchQuery]);

  const [stats, setStats] = useState({ messages: 0, streak: 7, hours: 12, modules: MODULES.length });

  useEffect(() => {
    try {
      const count = Object.keys(localStorage).filter(k => k.startsWith("cyberai_owner_messages_")).length;
      setStats(prev => ({ ...prev, messages: count }));
    } catch {}
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Owner Workspace</h1>
          <p className="text-sm text-zinc-400 mb-6">Enter your admin password to access your private AI operating system.</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Admin password" autoFocus
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-3"
          />
          {authError && <p className="text-sm text-red-400 mb-3">Wrong password.</p>}
          <Button onClick={handleLogin} className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0">
            <Zap className="h-4 w-4 mr-2" /> Unlock Workspace
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 lg:px-6 py-2.5 border-b border-zinc-800/80 bg-[#0a0a0f]/90 backdrop-blur-xl z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              <span className="text-zinc-400">owner</span>
              <span className="text-white">/</span>
              <span className="text-violet-300">{currentModule.label}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowSearch(!showSearch); if (!showSearch) setSearchQuery(""); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
              <Star className="h-3 w-3 text-amber-400" />
              <span>{stats.streak} day streak</span>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20">
              <User className="h-3.5 w-3.5 text-violet-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Global search overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-4 right-4 z-40 mx-auto max-w-2xl"
          >
            <div className="rounded-xl border border-violet-500/30 bg-zinc-900 shadow-2xl shadow-violet-500/10 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search modules, or type a natural language query..." autoFocus
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {searchQuery && (
                <div className="p-2 max-h-60 overflow-y-auto">
                  {filteredModules.map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => { selectModule(m.id); setSearchQuery(""); setShowSearch(false); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-all"
                      >
                        <Icon className="h-4 w-4 text-violet-400" />
                        <div className="text-left">
                          <span>{m.label}</span>
                          <span className="block text-[10px] text-zinc-500">{m.description}</span>
                        </div>
                      </button>
                    );
                  })}
                  {filteredModules.length === 0 && (
                    <div className="px-3 py-4 text-xs text-zinc-500 text-center">
                      No modules found. Try asking the AI in chat.
                    </div>
                  )}
                </div>
              )}
              <div className="px-4 py-2 bg-zinc-950/50 text-[10px] text-zinc-600">
                Press Enter to search · Type a module name or ask anything
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-56" : "w-0"} transition-all duration-300 border-r border-zinc-800/80 bg-[#0a0a0f] flex flex-col shrink-0 overflow-hidden`}>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-thin">
            {MODULES.map(m => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button key={m.id} onClick={() => selectModule(m.id)}
                  onMouseEnter={() => setShowModuleInfo(m.id)}
                  onMouseLeave={() => setShowModuleInfo(null)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all ${
                    isActive
                      ? "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                  <span className="truncate">{m.label}</span>
                  {m.badge && <Badge className="ml-auto text-[8px] px-1 py-0">{m.badge}</Badge>}
                </button>
              );
            })}
          </div>
          <div className="p-3 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-[10px] text-zinc-600">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span>AI Online</span>
              <span className="ml-auto">{MODULES.length} modules</span>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0d0d14]">
          {activeModule === "dashboard" ? (
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold mb-1">Welcome back, Owner</h1>
                <p className="text-sm text-zinc-400 mb-8">Your private AI operating system — {stats.modules} modules ready.</p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Brain, label: "Active Modules", value: stats.modules.toString(), color: "violet" },
                    { icon: Star, label: "Day Streak", value: `${stats.streak}d`, color: "amber" },
                    { icon: Clock, label: "Learning Hours", value: `${stats.hours}h`, color: "blue" },
                    { icon: MessageCircle, label: "Conversations", value: stats.messages.toString(), color: "emerald" },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${s.color}-500/10 mb-3`}>
                          <Icon className={`h-4 w-4 text-${s.color}-400`} />
                        </div>
                        <p className="text-xs text-zinc-500">{s.label}</p>
                        <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Quick module grid */}
                <h2 className="text-sm font-semibold text-zinc-300 mb-4">Quick Access</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {MODULES.filter(m => m.id !== "dashboard").map(m => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} onClick={() => selectModule(m.id)}
                        className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-3.5 text-left hover:bg-zinc-800/50 hover:border-zinc-700 transition-all group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 group-hover:bg-violet-500/20 transition-all">
                          <Icon className="h-4 w-4 text-violet-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-300 truncate">{m.label}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{m.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Module header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-zinc-800/80 bg-[#0d0d14]">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                    {(() => { const Icon = currentModule.icon; return <Icon className="h-4 w-4 text-violet-400" />; })()}
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-200">{currentModule.label}</h2>
                    <p className="text-[10px] text-zinc-500">{currentModule.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={clearChat} className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all" title="Clear chat">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Chat area */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="mx-auto max-w-3xl space-y-5">
                  {messages.length === 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-16"
                    >
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                        {(() => { const Icon = currentModule.icon; return <Icon className="h-7 w-7 text-violet-400" />; })()}
                      </div>
                      <h2 className="text-lg font-semibold text-zinc-200 mb-1">{currentModule.label}</h2>
                      <p className="text-sm text-zinc-500 text-center max-w-md mb-8">{currentModule.description}</p>
                      {QUICK_ACTIONS[activeModule] && (
                        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                          {QUICK_ACTIONS[activeModule].map((action, i) => {
                            const Icon = action.icon;
                            return (
                              <button key={i} onClick={() => setInput(action.input)}
                                className="flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-all"
                              >
                                <Icon className="h-4 w-4 text-violet-400" />
                                {action.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {!QUICK_ACTIONS[activeModule] && (
                        <p className="text-xs text-zinc-600">Type a message below to start.</p>
                      )}
                    </motion.div>
                  )}

                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 mt-0.5">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] ${msg.role === "user" ? "order-first" : ""}`}>
                        {msg.files && msg.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 justify-end">
                            {msg.files.map((f, i) => (
                              <div key={i} className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2.5 py-1.5 text-[10px] text-violet-300">
                                <FileText className="h-3 w-3" />
                                {f.name}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-violet-600 text-white rounded-xl rounded-tr-sm"
                            : "bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 rounded-xl rounded-tl-sm"
                        }`}>{msg.text}</div>
                      </div>
                      {msg.role === "user" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 mt-0.5">
                          <User className="h-4 w-4 text-violet-400" />
                        </div>
                      )}
                    </div>
                  ))}

                  <AnimatePresence>
                    {loading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3 items-start">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/80 px-4 py-3">
                          <span className="inline-flex gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="h-2 w-2 rounded-full bg-violet-400/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="h-2 w-2 rounded-full bg-violet-400/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={chatEnd} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-zinc-800/80 bg-[#0d0d14] px-6 py-4">
                <div className="mx-auto max-w-3xl">
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attachedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 px-2.5 py-1.5 text-[10px] text-violet-300">
                          <FileText className="h-3 w-3" />
                          <span className="max-w-[120px] truncate">{f.name}</span>
                          <button onClick={() => removeFile(i)} className="text-zinc-500 hover:text-zinc-300 ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-2 focus-within:border-violet-500/50 transition-all">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
                      title="Upload file (txt, md, pdf, code)"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept=".txt,.md,.pdf,.py,.js,.ts,.jsx,.tsx,.go,.rs,.java,.json,.yaml,.yml,.csv,.xml,.html,.css,.sh,.sql,.env" className="hidden" onChange={handleFileUpload} />
                    <button onClick={toggleRecording}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                        recording ? "bg-red-500 text-white animate-pulse" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                      }`}
                      title={recording ? "Stop recording" : "Voice input"}
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                    <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={`Ask anything in ${currentModule.label} mode...`}
                      disabled={loading} rows={1}
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none max-h-[120px] disabled:opacity-40"
                    />
                    <button onClick={sendMessage} disabled={loading || (!input.trim() && attachedFiles.length === 0)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
