"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown, Shield, Bot, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  { icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", title: "AI-Powered Learning", desc: "Ask any cybersecurity question and get clear, beginner-friendly explanations with analogies you'll actually understand." },
  { icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z", title: "Always Free", desc: "No sign-ups, no credit cards, no limits. Premium AI cybersecurity education, completely free for everyone." },
  { icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418", title: "30+ Topics", desc: "From passwords and phishing to firewalls and zero-days — we cover everything a beginner needs to know." },
  { icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z", title: "Works Offline", desc: "Our local AI engine answers cybersecurity questions even without internet — no API key required." },
  { icon: "M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12", title: "Beginner Friendly", desc: "No prior knowledge needed. We start from zero and build up, one concept at a time, at your pace." },
  { icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", title: "Instant Responses", desc: "Get answers in milliseconds from our local engine, or tap into Gemini AI for cloud-powered depth." },
];

const PRICING = [
  { name: "Free", price: "$0", period: "/forever", desc: "Everything you need to start learning cybersecurity.", features: ["Unlimited local AI queries", "30+ cybersecurity topics", "Multiple chat sessions", "Dark mode", "Works offline"], cta: "Start Learning", popular: false },
  { name: "Gemini Boost", price: "Free", period: "", desc: "AI-powered responses from Google's Gemini models.", features: ["Everything in Free", "Gemini 2.5 Flash Lite", "Gemini 3.1 Flash Lite", "Gemini 3.5 Flash", "Choose your model", "Smarter responses"], cta: "Add API Key", popular: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "For organizations and teams.", features: ["Everything in Boost", "API access", "Custom integrations", "Dedicated support", "On-premise deployment", "SLA guarantee"], cta: "Contact Us", popular: false },
];

const FAQS = [
  { q: "What is CyberAI Tutor?", a: "CyberAI Tutor is a free AI-powered platform that teaches cybersecurity to beginners. You can ask questions, explore topics, and learn at your own pace — no experience required." },
  { q: "Do I need an API key to use it?", a: "No! The local AI engine works right out of the box with no API key. If you want Gemini-powered responses, just add your free Gemini API key in the .env.local file." },
  { q: "Is it really free?", a: "Yes, completely free. The local engine has no costs. Gemini API also has a generous free tier (up to 1,000 requests per day with certain models)." },
  { q: "What topics do you cover?", a: "We cover 30+ cybersecurity topics including passwords, phishing, firewalls, encryption, ransomware, social engineering, SQL injection, XSS, VPNs, zero-days, penetration testing, incident response, prompt injection, and much more." },
  { q: "Do I need any prior knowledge?", a: "None at all. CyberAI Tutor is designed for complete beginners. We explain everything using simple language and real-world analogies." },
  { q: "Is this safe to use?", a: "Absolutely. Our AI teaches defensive cybersecurity concepts. We explain how attacks work so you can understand and prevent them — not to enable harmful activity." },
];

const TESTIMONIALS = [
  { name: "Alex M.", role: "Career Switcher", text: "I knew nothing about cybersecurity before using CyberAI Tutor. The AI explained complex topics like encryption using analogies that finally made it click for me." },
  { name: "Jamie K.", role: "High School Student", text: "My teacher recommended this to learn about online safety. The phishing lessons helped me spot a scam email that my parents almost fell for!" },
  { name: "Dr. Rivera", role: "IT Instructor", text: "I recommend CyberAI Tutor to all my students who need extra help. The local engine works even when they don't have internet access." },
];

export default function Home() {
  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">


      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-32 pb-20 sm:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/8 to-primary/5 blur-3xl animate-pulse" />
          <div className="absolute -bottom-64 right-[-200px] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative mx-auto max-w-5xl text-center">
          <Badge variant="secondary" className="mb-8 gap-2 px-4 py-1.5 text-sm">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
            AI-Powered Cybersecurity Education
          </Badge>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl">
            Learn Cybersecurity{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">with AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Your personal AI tutor teaches cybersecurity through natural conversation. Ask anything, learn at your pace — no experience needed.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/chat">
              <Button size="lg" className="h-14 rounded-xl px-10 text-base">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 rounded-xl px-10 text-base" onClick={() => scrollTo("features")}>
              Explore Features
            </Button>
          </div>
          <div className="mt-16 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Shield className="h-4 w-4" />30+ Topics</span>
            <span className="inline-flex items-center gap-1.5"><Bot className="h-4 w-4" />AI Tutor</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-4 w-4" />Works Offline</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">Everything you need to learn cybersecurity</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">AI-powered, beginner-friendly, and completely free.</p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={f.icon} /></svg>
                </div>
                <h3 className="mb-2 text-base font-semibold text-card-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Demo */}
      <section className="bg-background px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">Demo</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">See it in action</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Ask any cybersecurity question and get instant, clear answers.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="relative mx-auto max-w-3xl">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/5 via-primary/5 to-transparent blur-xl" />
            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-400" /></div>
                <span className="ml-2 text-xs text-muted-foreground">CyberAI Tutor — Chat Demo</span>
              </div>
              <div className="max-h-[400px] min-h-[300px] space-y-4 overflow-y-auto p-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
                  <div className="max-w-[80%] rounded-xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm shadow-sm">Hi! I'm CyberAI Tutor. Ask me anything about cybersecurity — from passwords to network security. What would you like to learn?</div>
                </div>
                <div className="flex justify-end gap-3">
                  <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">What is phishing and how do I spot it?</div>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted"><User className="h-4 w-4 text-muted-foreground" /></div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
                  <div className="max-w-[80%] rounded-xl rounded-tl-sm border border-border bg-card px-4 py-2.5 text-sm shadow-sm">Great question! Phishing is when attackers send fake emails that look real to trick you into revealing sensitive info. Think of it like someone dressing up as a delivery driver to get you to open your door.<br /><br /><strong>How to spot it:</strong> Check the sender's email address carefully, look for urgent language, hover over links before clicking, and never share passwords via email.</div>
                </div>
              </div>
              <div className="border-t border-border bg-muted/30 px-4 py-3">
                <Link href="/chat" className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground">
                  <span className="flex-1 text-left">Ask a cybersecurity question...</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">Completely free, forever</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">No hidden fees, no credit cards, no limits.</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {PRICING.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md p-7 ${
                  p.popular ? "border-primary/40 shadow-lg shadow-primary/5" : "border-border"
                }`}
              >
                {p.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                <h3 className="text-lg font-semibold text-card-foreground">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-card-foreground">{p.price}</span>
                  {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={p.popular ? "/chat" : p.name === "Enterprise" ? "#" : "/chat"}>
                  <Button variant={p.popular ? "default" : "outline"} className="mt-8 w-full">{p.cta}</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">Loved by learners</h2>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => <svg key={j} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>)}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
                <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-muted px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">Frequently asked questions</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-card-foreground list-none">
                  {f.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground px-6 py-20 sm:py-28 text-background">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-5xl">Ready to start learning?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-70">Join thousands of learners mastering cybersecurity with AI. No sign-up needed.</p>
          <Link href="/chat">
            <Button size="lg" className="mt-8 h-14 rounded-xl border-border bg-background px-10 text-base text-foreground hover:bg-background/90">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md overflow-hidden">
              <img src="/CyberAI.png" alt="" className="h-6 w-6 object-cover" />
            </div>
            <span className="text-sm font-semibold">CyberAI Tutor</span>
          </div>
          <p className="text-xs text-muted-foreground">&copy; 2026 CyberAI Tutor. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
