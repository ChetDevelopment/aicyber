"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Terminal, Shield, AlertTriangle, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const CHALLENGES = [
  {
    id: "xss",
    title: "Stored XSS",
    desc: "This comment form stores user input without sanitization. Try injecting a script.",
    code: `<form id="commentForm">\n  <input name="comment" placeholder="Leave a comment..." />\n  <button>Submit</button>\n</form>\n<div id="comments">\n  <p>Great article!</p>\n</div>`,
    hint: "Try: <script>alert('XSS')</script> or <img src=x onerror=alert(1)>",
    solution: "<script>alert('XSS')</script>",
  },
  {
    id: "sqli",
    title: "SQL Injection (Login Bypass)",
    desc: "This login form is vulnerable to SQL injection. Bypass the password check.",
    code: `SELECT * FROM users\nWHERE username = 'admin'\n  AND password = '???';`,
    hint: "Try: admin' -- or admin' OR '1'='1",
    solution: "admin' --",
  },
  {
    id: "idor",
    title: "Insecure Direct Object Reference",
    desc: "Try accessing another user's invoice by changing the ID parameter.",
    code: `GET /api/invoice?id=101\n→ { user_id: 1, total: 249.99 }\n\nGET /api/invoice?id= ???`,
    hint: "Try: id=102, id=100, id=1",
    solution: "/api/invoice?id=102",
  },
];

export default function Sandbox() {
  const [active, setActive] = useState("xss");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [solved, setSolved] = useState<string[]>([]);

  const challenge = CHALLENGES.find(c => c.id === active)!;

  const run = () => {
    const lines = [...output, `$ ${input}`];

    if (active === "xss") {
      if (input.includes("<script>") || input.includes("onerror=")) {
        lines.push("🔥 XSS payload detected! The script executed in the victim's browser.");
        if (!solved.includes("xss")) setSolved([...solved, "xss"]);
      } else {
        lines.push("Comment submitted. No XSS detected. Try a script tag.");
      }
    } else if (active === "sqli") {
      if (input.includes("' --") || input.includes("' OR")) {
        lines.push("✅ SQL injection successful! Logged in as admin without password.");
        if (!solved.includes("sqli")) setSolved([...solved, "sqli"]);
      } else {
        lines.push("❌ Invalid password. Try manipulating the SQL query.");
      }
    } else if (active === "idor") {
      const match = input.match(/id=(\d+)/);
      if (match) {
        const id = parseInt(match[1]);
        if (id >= 100 && id <= 103) {
          lines.push(`📄 Invoice #${id}: User ID ${id - 100}, Total: $${(Math.random() * 500 + 50).toFixed(2)}`);
          if (!solved.includes("idor")) setSolved([...solved, "idor"]);
        } else {
          lines.push("❌ Invoice not found. Try different IDs (100-103).");
        }
      } else {
        lines.push("ℹ️ Enter a URL like: /api/invoice?id=102");
      }
    }

    setOutput(lines);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hack This Page</h1>
              <p className="text-sm text-muted-foreground">Safe, educational vulnerability playground. No real exploits.</p>
            </div>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto">
            {CHALLENGES.map(c => (
              <button key={c.id} onClick={() => { setActive(c.id); setOutput([]); setInput(""); }}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                  active === c.id
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {solved.includes(c.id) && <Shield className="h-3.5 w-3.5 text-emerald-500" />}
                {c.title}
              </button>
            ))}
          </div>

          <div className="mb-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-xs font-medium text-muted-foreground">{challenge.title}</span>
              <div className="flex items-center gap-2">
                {solved.includes(active) && <Badge variant="success">Solved</Badge>}
                <Badge variant="warning" className="text-[10px]">Educational</Badge>
              </div>
            </div>
            <div className="p-4">
              <p className="mb-3 text-sm text-muted-foreground">{challenge.desc}</p>
              <pre className="mb-4 rounded-lg bg-muted p-3 text-xs text-foreground overflow-x-auto">{challenge.code}</pre>

              <div className="mb-3 flex items-center gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") run(); }}
                  placeholder="Type your payload here..." autoFocus
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button size="sm" onClick={run} disabled={!input.trim()}>
                  <Play className="h-3.5 w-3.5 mr-1" /> Run
                </Button>
                <button onClick={() => setOutput([])} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground transition-all">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-lg border border-border bg-[#0a0a0f] p-3 font-mono text-xs" style={{ minHeight: 120 }}>
                {output.length === 0 ? (
                  <span style={{ color: "#6b7280" }}>// Output will appear here. Try typing a payload and clicking Run.</span>
                ) : (
                  output.map((line, i) => (
                    <div key={i} className={`${line.startsWith("🔥") || line.startsWith("✅") ? "text-emerald-400" : line.startsWith("❌") ? "text-red-400" : line.startsWith("$") ? "text-[#e4e4e7]" : "text-[#6b7280]"}`}>
                      {line}
                    </div>
                  ))
                )}
              </div>

              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">💡 Hint</summary>
                <p className="mt-1 text-xs text-muted-foreground">{challenge.hint}</p>
              </details>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-muted-foreground">
                This sandbox is fully simulated. No actual code execution occurs. All vulnerabilities are educational demonstrations.
                Never test security exploits on real websites without explicit authorization.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
