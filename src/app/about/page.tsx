"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Shield, BookOpen, Target, ArrowRight, ChevronRight, Star, GraduationCap, Users, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Topics Covered", value: "30+" },
  { label: "AI Models", value: "4" },
  { label: "Cost", value: "Free" },
  { label: "Setup", value: "Instant" },
];

const highlights = [
  {
    icon: Shield,
    title: "Safe by Design",
    desc: "Learn about cybersecurity risks in a controlled, educational environment. Our AI explains threats defensively — how to recognize and prevent them, never how to execute them.",
  },
  {
    icon: BookOpen,
    title: "Beginner-First Approach",
    desc: "Every concept starts from zero. We use analogies, real-world examples, and plain language to make security accessible whether you are a student, professional, or just curious.",
  },
  {
    icon: Target,
    title: "Practical Knowledge",
    desc: "Theory matters, but practice matters more. Learn how to spot phishing emails, create strong passwords, recognize social engineering, and protect your digital life.",
  },
];

const principles = [
  {
    icon: GraduationCap,
    title: "Learn by Asking",
    desc: "No rigid curriculum. Ask any question and get an answer tailored to your level.",
  },
  {
    icon: Layers,
    title: "Start Small, Go Deep",
    desc: "Begin with 'what is a password?' and work up to network security, encryption, and threat analysis.",
  },
  {
    icon: Users,
    title: "For Everyone",
    desc: "Students, teachers, professionals, parents — cybersecurity literacy is for everyone, not just IT experts.",
  },
  {
    icon: Star,
    title: "AI-Enhanced",
    desc: "Powered by Gemini and Groq AI with a local fallback engine. Get cloud depth or offline reliability.",
  },
];

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 sm:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">About</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            What is{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">CyberAI Tutor</span>
            ?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            An AI-powered platform that makes cybersecurity education free, accessible, and actually understandable.
            No jargon. No intimidation. Just clear, conversational teaching.
          </p>
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border bg-muted/50">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-8 px-6 py-10 sm:gap-16">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <p className="text-2xl font-bold text-foreground sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">Why It Works</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">Built for real learning</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Not just another chatbot — a structured approach to cybersecurity education.</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {highlights.map((h, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <h.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-card-foreground">{h.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{h.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-muted px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">Our Principles</Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">How we teach</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Four principles that guide every response.</p>
          </motion.div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
            {principles.map((p, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="px-6 py-20 sm:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">Tech Stack</Badge>
          <h2 className="text-3xl font-bold sm:text-5xl">What powers CyberAI Tutor</h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Next.js 16", "Tailwind CSS v4", "TypeScript", "Gemini AI", "Groq AI", "Local Engine", "Framer Motion", "Lucide Icons"].map(t => (
              <Badge key={t} variant="secondary" className="px-3 py-1.5 text-sm">{t}</Badge>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-foreground px-6 py-20 sm:py-28 text-background">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold sm:text-5xl">Start your cybersecurity journey</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-70">No sign-up. No cost. Just ask a question and start learning.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/chat">
              <Button size="lg" className="h-14 rounded-xl border-border bg-background px-10 text-base text-foreground hover:bg-background/90">
                Start Learning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="h-14 rounded-xl border border-background/20 bg-transparent px-10 text-base text-background hover:bg-background/10">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
