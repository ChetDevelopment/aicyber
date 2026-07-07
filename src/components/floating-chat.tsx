"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, User, ChevronDown, Shield, Key, Mail, Lock } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const WIDGET_SUGGESTIONS = [
  "What is phishing?",
  "How to create strong passwords?",
  "What is 2FA?",
  "How does encryption work?",
];

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const savedModel = useMemo(() => {
    if (typeof window === "undefined") return "gemini-2.0-flash";
    try { return localStorage.getItem("cyberai_model") || "gemini-2.0-flash"; } catch { return "gemini-2.0-flash"; }
  }, []);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && textRef.current) {
      textRef.current.focus();
    }
  }, [open]);

  const sendMessage = async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history, model: savedModel }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: data.reply || "Could you rephrase that?" }]);
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: "Sorry, hit an error. Try again?" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-primary/40 active:scale-95"
        aria-label="Open CyberAI Tutor chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 right-5 z-50 flex w-[380px] flex-col rounded-2xl border border-border bg-background shadow-2xl shadow-primary/10"
            style={{ height: "min(600px, calc(100vh - 80px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">CyberAI Tutor</span>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-primary-foreground/20 transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center px-2">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mb-1 text-center text-sm font-medium text-foreground">Ask anything about cybersecurity</p>
                  <p className="mb-5 text-center text-xs text-muted-foreground">Quick questions, instant answers from AI.</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {WIDGET_SUGGESTIONS.map(s => (
                      <button key={s} onClick={() => sendMessage(s)}
                        className="rounded-lg border border-border bg-muted px-2.5 py-1.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground transition-all active:scale-95"
                      >{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(msg => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}
                  className={`flex gap-2 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary mt-0.5">
                      <Sparkles className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === "user" ? "order-first" : ""}`}>
                    <div className={`px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-xl rounded-tr-sm"
                        : "bg-secondary text-secondary-foreground border border-border rounded-xl rounded-tl-sm"
                    }`}>{msg.text}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                      <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2 items-start">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary">
                      <Sparkles className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="rounded-xl rounded-tl-sm border border-border bg-secondary px-3 py-2">
                      <span className="inline-flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEnd} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-end gap-2 rounded-xl border border-input bg-accent/30 px-3 py-1.5 focus-within:border-ring/50 transition-all">
                <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Ask a question..." disabled={loading} rows={1}
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-none max-h-[80px] disabled:opacity-40 scrollbar-thin"
                />
                <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all active:scale-95"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-center text-[10px] text-muted-foreground">Powered by CyberAI Tutor</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
