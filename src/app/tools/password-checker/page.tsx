"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, Copy, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

function entropy(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/\d/.test(password)) pool += 10;
  if (/[^a-zA-Z\d]/.test(password)) pool += 32;
  return password.length * Math.log2(pool || 1);
}

function timeToCrack(entropy: number): string {
  const guesses = Math.pow(2, entropy);
  const perSecond = 1e9;
  const seconds = guesses / perSecond;
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  return `${Math.round(seconds / 31536000)} years`;
}

function generatePassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = upper + lower + digits + special;
  let pw = "";
  pw += upper[Math.floor(Math.random() * upper.length)];
  pw += lower[Math.floor(Math.random() * lower.length)];
  pw += digits[Math.floor(Math.random() * digits.length)];
  pw += special[Math.floor(Math.random() * special.length)];
  for (let i = 0; i < 12; i++) pw += all[Math.floor(Math.random() * all.length)];
  return pw.split("").sort(() => Math.random() - 0.5).join("");
}

export default function PasswordChecker() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState("");

  const e = entropy(pw);
  const crack = timeToCrack(e);
  const strength = e < 28 ? "weak" : e < 48 ? "fair" : e < 64 ? "strong" : "very-strong";

  const strengthColor: Record<string, string> = {
    weak: "bg-red-500",
    fair: "bg-amber-500",
    strong: "bg-blue-500",
    "very-strong": "bg-emerald-500",
  };

  const strengthLabel: Record<string, string> = {
    weak: "Weak",
    fair: "Fair",
    strong: "Strong",
    "very-strong": "Very Strong",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Password Strength Checker</h1>
              <p className="text-sm text-muted-foreground">Test how strong your passwords really are.</p>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="Type a password to check..."
                  className="w-full rounded-xl border border-input bg-background pr-20 pl-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button onClick={() => setShow(!show)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-all">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {pw.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((e / 80) * 100, 100)}%` }} transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${strengthColor[strength]}`}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={strength === "very-strong" ? "success" : strength === "strong" ? "default" : strength === "fair" ? "warning" : "destructive"}>
                      {strengthLabel[strength]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{pw.length} characters</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                      <p className="text-xs text-muted-foreground">Entropy</p>
                      <p className="text-lg font-bold text-foreground">{e.toFixed(1)} bits</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-4 py-3">
                      <p className="text-xs text-muted-foreground">Time to Crack</p>
                      <p className="text-lg font-bold text-foreground">{crack}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {!/[a-z]/.test(pw) && <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Add lowercase letters</p>}
                    {!/[A-Z]/.test(pw) && <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Add uppercase letters</p>}
                    {!/\d/.test(pw) && <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Add numbers</p>}
                    {!/[^a-zA-Z\d]/.test(pw) && <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Add special characters</p>}
                    {pw.length < 12 && <p className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Make it at least 12 characters</p>}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate Strong Password</CardTitle>
              <CardDescription>Need a secure password? Generate one instantly.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => { const g = generatePassword(); setGenerated(g); setPw(g); }} className="w-full mb-3">
                Generate Password
              </Button>
              {generated && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
                  <span className="flex-1 font-mono text-sm text-foreground break-all">{generated}</span>
                  <button onClick={() => { navigator.clipboard.writeText(generated); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-all"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
