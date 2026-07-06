"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flag, Lock, Check, X, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const CHALLENGES = [
  {
    id: 1, title: "Base64 Decode", difficulty: "Easy", points: 10,
    description: "Decode this Base64 string to find the flag.",
    challenge: "ZmxhZ3t3ZWxjb21lX3RvX2N5YmVyY2hhbGxlbmdlfQ==",
    flag: "flag{welcome_to_cyberchallenge}",
    hint: "Use an online Base64 decoder or the browser console: atob('...')",
  },
  {
    id: 2, title: "Caesar Cipher", difficulty: "Easy", points: 15,
    description: "This message was encrypted with a Caesar cipher (shift 7). Decrypt it.",
    challenge: "Lzahuk pz av mwpuk ovd av zva clhy!",
    flag: "security is to fight how to get fear!",
    hint: "Shift each letter back by 7 positions. A=Z, B=A...",
  },
  {
    id: 3, title: "Hex Decode", difficulty: "Easy", points: 10,
    description: "Convert this hex string to ASCII text.",
    challenge: "666c61677b6833785f346e645f737472316e67737d",
    flag: "flag{hex_4nd_str1ngs}",
    hint: "You can use parseInt('...', 16) and String.fromCharCode() in the console.",
  },
  {
    id: 4, title: "Binary Decode", difficulty: "Medium", points: 20,
    description: "This binary string spells out a message. Decode it.",
    challenge: "01000110 01001100 01000001 01000111 01111011 01100010 00110001 01101110 00110100 01110010 01111001 01011111 01101101 00110011 01101101 00110011 01110011 01111101",
    flag: "flag{b1n4ry_m3m3s}",
    hint: "Each 8-bit binary number is one ASCII character.",
  },
  {
    id: 5, title: "Morse Code", difficulty: "Medium", points: 25,
    description: "Decode this Morse code message.",
    challenge: "..-. .-.. .- --. .--. .... .. ... .... .. -. --. .. ... ..-. ..- -.",
    flag: "flagphishingisfun",
    hint: "Morse code uses dots and dashes. Each letter is separated by a space.",
  },
  {
    id: 6, title: "Rot13", difficulty: "Hard", points: 30,
    description: "This uses ROT13 (same as Caesar shift 13). But there's a twist — the flag is hidden in reverse order too.",
    challenge: "synt{ebg13_vf_rnfl}",
    flag: "flag{rot13_is_easy}",
    hint: "ROT13 is its own inverse. Apply ROT13 twice to get back to the original. Also check the string order.",
  },
];

const STORAGE_KEY = "cyberai_ctf_progress";

export default function Challenges() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [solved, setSolved] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [reveal, setReveal] = useState<number | null>(null);

  const totalPoints = solved.reduce((sum, id) => sum + (CHALLENGES.find(c => c.id === id)?.points || 0), 0);

  const checkFlag = (id: number) => {
    const challenge = CHALLENGES.find(c => c.id === id);
    if (!challenge) return;
    const answer = (answers[id] || "").trim().toLowerCase();
    if (answer === challenge.flag.toLowerCase()) {
      if (!solved.includes(id)) {
        const next = [...solved, id];
        setSolved(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Flag className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">CTF Challenges</h1>
              </div>
              <p className="text-sm text-muted-foreground">Solve puzzles, capture flags, earn points.</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
          </div>

          <div className="space-y-4">
            {CHALLENGES.map((c, i) => {
              const isSolved = solved.includes(c.id);
              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`transition-all ${isSolved ? "border-emerald-500/40 bg-emerald-500/5" : ""}`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isSolved ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground"
                          }`}>
                            {isSolved ? <Check className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant={c.difficulty === "Easy" ? "success" : c.difficulty === "Medium" ? "warning" : "destructive"} className="text-[10px] px-1.5 py-0">
                                {c.difficulty}
                              </Badge>
                              <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                                <Star className="h-3 w-3" /> {c.points} pts
                              </span>
                            </div>
                          </div>
                        </div>
                        {isSolved && <Badge variant="success" className="gap-1"><Check className="h-3 w-3" /> Solved</Badge>}
                      </div>

                      <p className="mb-3 text-sm text-muted-foreground">{c.description}</p>

                      <div className="mb-3 rounded-lg bg-muted/50 p-3 font-mono text-xs text-foreground break-all">
                        {c.challenge}
                      </div>

                      <div className="flex items-center gap-2">
                        <input value={answers[c.id] || ""} onChange={e => setAnswers({ ...answers, [c.id]: e.target.value })}
                          onKeyDown={e => { if (e.key === "Enter") checkFlag(c.id); }}
                          placeholder="Enter flag..." disabled={isSolved}
                          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        />
                        <Button size="sm" onClick={() => checkFlag(c.id)} disabled={isSolved || !answers[c.id]?.trim()}>Submit</Button>
                        <button onClick={() => setReveal(reveal === c.id ? null : c.id)}
                          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2"
                        >
                          {reveal === c.id ? "Hide" : "Hint"}
                        </button>
                      </div>

                      {reveal === c.id && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs text-muted-foreground">
                          💡 {c.hint}
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
