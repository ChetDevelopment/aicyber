"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Briefcase, DollarSign, Clock, Building2,
  Filter, X, ChevronRight, ExternalLink, BookOpen,
  FileText, MessageCircle, Sparkles, ArrowLeft, Check, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: number; title: string; company: string; location: string;
  salary: string; type: string; category: string; posted: string; logo: string;
  description: string; requirements: string[]; benefits: string[]; applyUrl: string;
}

interface Category { id: string; label: string; }

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAi, setShowAi] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: string; text: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [applied, setApplied] = useState<number[]>([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set("keyword", keyword);
      if (location) params.set("location", location);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      if (data.categories) setCategories(data.categories);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [category]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchJobs(); };

  const apply = async (job: Job) => {
    if (applied.includes(job.id)) return;
    setApplied(prev => [...prev, job.id]);
  };

  const sendAiMessage = async () => {
    const msg = aiInput.trim();
    if (!msg || aiLoading) return;
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", text: msg }]);
    setAiLoading(true);
    try {
      const context = selectedJob
        ? `The user is looking at this job: ${selectedJob.title} at ${selectedJob.company}. Requirements: ${selectedJob.requirements.join(", ")}.`
        : "The user is browsing jobs in Cambodia.";
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg, history: aiMessages.map(m => ({ role: m.role, text: m.text })),
          model: "gemini-2.0-flash",
          systemPrompt: `You are a job search assistant for Cambodia. Help users with:
- Resume and CV building tips
- Cover letter writing
- Interview preparation and common questions
- Salary negotiation advice
- Job search strategies in Cambodia
- Career advice for the Cambodian job market

Context: ${context}

Be practical and specific to Cambodia. Provide examples and templates when helpful.`,
        }),
      });
      const data = await res.json();
      setAiMessages(prev => [...prev, { role: "assistant", text: data.reply || "I'm not sure how to answer that." }]);
    } catch {}
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Job Search</h1>
              <p className="text-sm text-muted-foreground">Find your next opportunity in Cambodia</p>
            </div>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder="Job title, skill, or keyword..." autoFocus
                className="w-full h-12 rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={location} onChange={e => setLocation(e.target.value)}
                placeholder="Location..." autoFocus={false}
                className="w-full sm:w-44 h-12 rounded-xl border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button type="submit" className="h-12 rounded-xl px-8">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </form>

          {/* Category filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {categories.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  category === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex gap-6">
          {/* Job listings */}
          <div className={`flex-1 ${selectedJob ? "hidden lg:block" : ""}`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{loading ? "Searching..." : `${jobs.length} jobs found`}</p>
              <button onClick={() => setShowAi(!showAi)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Assistant
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No jobs found. Try different search terms.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedJob(job)}
                    className={`rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
                      selectedJob?.id === job.id ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.posted}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 hidden sm:block" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Job details panel */}
          <AnimatePresence>
            {selectedJob && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-[420px] shrink-0"
              >
                <div className="sticky top-6 space-y-4">
                  <button onClick={() => setSelectedJob(null)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground lg:hidden">
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to results
                  </button>

                  <div className="rounded-xl border border-border bg-card p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                        {selectedJob.logo}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{selectedJob.title}</h2>
                        <p className="text-sm text-muted-foreground">{selectedJob.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-[10px]">{selectedJob.type}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{selectedJob.location}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{selectedJob.salary}</Badge>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed mb-4">{selectedJob.description}</p>

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-foreground mb-2">Requirements</h4>
                      <ul className="space-y-1">
                        {selectedJob.requirements.map((r, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>{r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-foreground mb-2">Benefits</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.benefits.map((b, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{b}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {applied.includes(selectedJob.id) ? (
                        <Button disabled className="w-full rounded-xl">
                          <Check className="h-4 w-4 mr-2" /> Applied
                        </Button>
                      ) : (
                        <Button onClick={() => apply(selectedJob)} className="w-full rounded-xl">
                          <ExternalLink className="h-4 w-4 mr-2" /> Apply Now
                        </Button>
                      )}
                      <Button variant="outline" onClick={() => { setShowAi(true); setAiInput(`Help me write a cover letter for the ${selectedJob.title} position at ${selectedJob.company}`); }}
                        className="w-full rounded-xl"
                      >
                        <FileText className="h-4 w-4 mr-2" /> AI Cover Letter
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Assistant panel */}
      <AnimatePresence>
        {showAi && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-0 right-0 z-50 w-full sm:w-[400px] h-[500px] border border-border bg-background shadow-2xl rounded-t-2xl sm:rounded-2xl sm:bottom-4 sm:right-4 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Job Search AI</span>
              </div>
              <button onClick={() => setShowAi(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiMessages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="h-8 w-8 mx-auto text-primary/50 mb-3" />
                  <p className="text-sm text-muted-foreground">Ask me about resume tips, cover letters, interview prep, or salary negotiation.</p>
                </div>
              )}
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}>{m.text}</div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-muted px-4 py-3">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendAiMessage())}
                  placeholder="Ask about jobs, resumes, interviews..." autoFocus={false}
                  className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button onClick={sendAiMessage} disabled={!aiInput.trim() || aiLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

