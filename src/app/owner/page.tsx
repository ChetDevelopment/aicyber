"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Lock, User, Shield, BookOpen, Terminal, Target,
  Code, Globe, Award, TrendingUp, Send, Bot,
  Briefcase, FileText, Mic, Paperclip, Languages,
  GraduationCap, Lightbulb, Route, ListChecks,
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

const PROGRAMMING_LANGUAGES = [
  "Python", "JavaScript", "Go", "Rust", "C/C++", "Bash", "SQL", "PowerShell",
];

const SKILLS: Skill[] = [
  { name: "XSS", level: 70, category: "Web Security" },
  { name: "SQL Injection", level: 60, category: "Web Security" },
  { name: "Firewalls", level: 75, category: "Network Security" },
  { name: "Phishing", level: 85, category: "Social Engineering" },
  { name: "Encryption", level: 55, category: "Cryptography" },
  { name: "Password Security", level: 90, category: "Web Security" },
];

const getSystemPrompt = (mode: string, context?: string) => {
  const base = "You are CyberAI Tutor, the personal AI assistant for the owner and creator of this platform. Be direct, knowledgeable, and warm.";

  const prompts: Record<string, string> = {
    tutor: `${base}

You are a PERSONAL TUTOR for the owner. Help them learn cybersecurity, programming, and technology.

When the owner asks to learn a topic:
1. First ask about their current knowledge level (beginner, intermediate, advanced)
2. Then create a structured lesson plan with clear goals
3. Teach step by step with practical examples and exercises
4. Quiz them to verify understanding
5. Track what they've learned and suggest next topics

When the owner asks to learn a programming language:
1. Assess their current programming experience
2. Create a personalized learning roadmap with milestones
3. Start with fundamentals, then advance to security-specific applications
4. Provide code examples and challenges
5. Suggest practice projects that combine the language with cybersecurity

Always adapt to the owner's pace and learning style. Be encouraging but honest about areas needing improvement.`,

    interview: `${base}

You are an INTERVIEW COACH. Help the owner prepare for job interviews in cybersecurity and tech.

When the owner shares a job description:
1. Analyze the JD and identify key skills, technologies, and requirements
2. Generate realistic interview questions based on the JD
3. Ask ONE question at a time (like a real interview)
4. After the owner answers, provide constructive feedback:
   - What they did well
   - What they could improve
   - A model answer for reference
5. Then ask the next question
6. Track which questions were answered well and which need practice

When the owner shares their CV/resume:
1. Review the CV thoroughly
2. Identify strengths and gaps relative to their target role
3. Suggest improvements to CV content and formatting
4. Ask questions about their experience to prepare them for interviews

Keep the conversation flowing naturally like a real interview. Start with "Let's begin. Tell me about yourself."`,

    review: `${base}

You are a CV & CAREER COACH. Help the owner prepare their job application materials.

When the owner shares their CV and job description:
1. Compare the CV against the JD requirements
2. Identify matching skills (strengths) and missing skills (gaps)
3. Suggest specific improvements to the CV
4. Recommend certifications, projects, or experience to fill gaps
5. Help craft a tailored cover letter

When the owner asks for interview prep:
1. Generate questions based on the specific role
2. Provide tips for answering behavioral questions (STAR method)
3. Help prepare technical questions relevant to the role

Be thorough and honest. The goal is to help the owner land the job.`,

    code: `${base}

You are a CODE REVIEWER focused on security. Help the owner write better, more secure code.

When the owner shares code:
1. Analyze it for security vulnerabilities (OWASP Top 10, etc.)
2. Check for coding best practices and potential bugs
3. Suggest improvements with specific code examples
4. Explain the security implications of each finding

Help the owner learn secure coding practices in any language.`,
  };

  return prompts[mode] || base;
};

const MODES = [
  { id: "tutor", icon: GraduationCap, label: "Personal Tutor" },
  { id: "interview", icon: Briefcase, label: "Interview Coach" },
  { id: "review", icon: FileText, label: "CV Review" },
  { id: "code", icon: Code, label: "Code Review" },
];

const QUICK_ACTIONS = [
  {
    mode: "tutor",
    icon: Route,
    label: "Learning Roadmap",
    input: "I want to create a personalized learning roadmap. I'll tell you my current skills and what I want to learn.",
  },
  {
    mode: "interview",
    icon: Briefcase,
    label: "Mock Interview",
    input: "I want to practice for a cybersecurity job interview. I'll share a job description and you can ask me questions.",
  },
  {
    mode: "review",
    icon: FileText,
    label: "CV Review",
    input: "I want you to review my CV. I'll paste it below along with the job description I'm targeting.",
  },
  {
    mode: "tutor",
    icon: Code,
    label: "Learn Programming",
    input: "I want to learn a new programming language for cybersecurity. Help me create a learning plan.",
  },
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
  const [activeTab, setActiveTab] = useState<"chat" | "progress" | "skills" | "languages">("chat");
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    return () => { recognitionRef.current?.stop(); };
  }, []);

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
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(prev => prev + transcript);
    };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setInput(prev => prev + (prev ? "\n\n" : "") + text);
    };
    const file = files[0];
    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".pdf")) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }
    e.target.value = "";
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
      const systemPrompt = getSystemPrompt(mode);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history,
          model: "gemini-2.0-flash",
          persona: mode,
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
            <span>{Math.round(SKILLS.reduce((a, s) => a + s.level, 0) / SKILLS.length)}% Mastery</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-72 border-r border-border bg-background flex flex-col shrink-0 overflow-y-auto">
          <div className="flex border-b border-border">
            {(["chat", "progress", "skills", "languages"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-medium transition-colors ${
                  activeTab === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "chat" ? "Chat" : tab === "progress" ? "Topics" : tab === "skills" ? "Skills" : "Languages"}
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

          {activeTab === "languages" && (
            <div className="p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Programming Languages</h3>
              <p className="text-[10px] text-muted-foreground">Select a language to start learning, or ask the AI to create a custom roadmap.</p>
              <div className="flex flex-wrap gap-1.5">
                {PROGRAMMING_LANGUAGES.map(lang => (
                  <button key={lang} onClick={() => { setMode("tutor"); setInput(`I want to learn ${lang} for cybersecurity. Create a personalized learning plan for me.`); setActiveTab("chat"); }}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                  >
                    <Code className="h-3 w-3" />
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="p-4 space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topics Covered</h3>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map(t => (
                  <button key={t} onClick={() => { setMode("tutor"); setInput(`Teach me about ${t}. I'm at an intermediate level.`); setActiveTab("chat"); }}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                  >
                    <Lightbulb className="h-3 w-3" />
                    {t}
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Suggested Next</h3>
                {["Zero-Day Exploits", "Threat Hunting", "DFIR", "Bug Bounty"].map(t => (
                  <button key={t} onClick={() => { setMode("tutor"); setInput(`Teach me about ${t}. I'm ready for advanced content.`); setActiveTab("chat"); }}
                    className="flex w-full items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 transition-all"
                  >
                    <TrendingUp className="h-3 w-3 text-primary" />
                    {t}
                  </button>
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
                {QUICK_ACTIONS.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button key={i} onClick={() => { setMode(action.mode); setInput(action.input); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary/70" />
                      {action.label}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Upload Files</h3>
                <input ref={fileInputRef} type="file" accept=".txt,.md,.pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  Upload CV / Cover Letter / JD
                </button>
              </div>

              {mode === "interview" && (
                <div className="pt-4 border-t border-border">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Interview Tips</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Paste a job description to get started. The AI will ask you real interview questions one at a time and give feedback on your answers.
                  </p>
                </div>
              )}

              {mode === "tutor" && (
                <div className="pt-4 border-t border-border">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Learning Tips</h3>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Tell me what you want to learn — a cybersecurity topic, programming language, or specific skill. I'll create a personalized lesson plan and track your progress.
                  </p>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-3xl space-y-5">
              {/* Mode indicator */}
              {mode && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                  {mode === "tutor" && <GraduationCap className="h-3.5 w-3.5 text-primary" />}
                  {mode === "interview" && <Briefcase className="h-3.5 w-3.5 text-primary" />}
                  {mode === "review" && <FileText className="h-3.5 w-3.5 text-primary" />}
                  {mode === "code" && <Code className="h-3.5 w-3.5 text-primary" />}
                  <span>
                    {mode === "tutor" && "Personal Tutor Mode — tell me what you want to learn"}
                    {mode === "interview" && "Interview Coach Mode — share a job description to begin"}
                    {mode === "review" && "CV Review Mode — paste your CV and target job description"}
                    {mode === "code" && "Code Review Mode — share your code for security analysis"}
                  </span>
                </div>
              )}

              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <GraduationCap className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold mb-1">Welcome, Owner</h2>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
                    Your personal AI learning companion. Choose a mode and start a conversation.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                    {QUICK_ACTIONS.map((action, i) => {
                      const Icon = action.icon;
                      return (
                        <button key={i} onClick={() => { setMode(action.mode); setInput(action.input); }}
                          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
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
                <button onClick={toggleRecording}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                    recording ? "bg-destructive text-destructive-foreground animate-pulse" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                  title={recording ? "Stop recording" : "Voice input"}
                >
                  <Mic className="h-4 w-4" />
                </button>
                <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={
                    mode === "tutor" ? "What do you want to learn today? (topic, language, skill...)" :
                    mode === "interview" ? "Paste a job description or type 'Start interview'..." :
                    mode === "review" ? "Paste your CV / cover letter / job description..." :
                    "Paste your code for security review..."
                  }
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
