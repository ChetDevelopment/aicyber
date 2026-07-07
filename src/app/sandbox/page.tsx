"use client";

import { useState, useRef, useEffect } from "react";
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
    hint: "Try: admin' -- or ' OR '1'='1",
    solution: "admin' --",
  },
  {
    id: "idor",
    title: "Insecure Direct Object Reference",
    desc: "Try accessing another user's invoice by changing the ID parameter.",
    code: `GET /api/invoice?id=101\n→ { user_id: 1, total: 249.99 }\n\nGET /api/invoice?id= ???`,
    hint: "Try: id=102, id=100, id=1",
    solution: "id=102",
  },
];

export default function Sandbox() {
  const [active, setActive] = useState("xss");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [solved, setSolved] = useState<string[]>([]);
  const [xssHtml, setXssHtml] = useState<string | null>(null);
  const [sqlReady, setSqlReady] = useState(false);
  const dbRef = useRef<any>(null);
  const initRef = useRef(false);

  const challenge = CHALLENGES.find(c => c.id === active)!;

  useEffect(() => {
    if (active === "sqli" && !initRef.current) {
      initRef.current = true;
      initSqlDatabase();
    }
  }, [active]);

  const initSqlDatabase = async () => {
    try {
      setOutput(prev => [...prev, "⏳ Loading SQL.js (WebAssembly)..."]);

      const sqlJsModule = await import("sql.js");
      const SQL = await sqlJsModule.default({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
      });

      const db = new SQL.Database();

      db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL
      )`);

      db.run("INSERT INTO users VALUES (1, 'admin', 'admin', 'admin@cyberai.com')");
      db.run("INSERT INTO users VALUES (2, 'john', 'password123', 'john@example.com')");
      db.run("INSERT INTO users VALUES (3, 'jane', 'flowerpot', 'jane@example.com')");
      db.run("INSERT INTO users VALUES (4, 'guest', 'guest', 'guest@cyberai.com')");

      dbRef.current = db;
      setSqlReady(true);
      setOutput(prev => [
        ...prev.filter(l => l !== "⏳ Loading SQL.js (WebAssembly)..."),
        "✅ Database initialized. Users table ready with 4 users.",
        "ℹ️ Try: admin' --  or  ' OR '1'='1",
      ]);
    } catch (err: any) {
      setOutput(prev => [
        ...prev.filter(l => l !== "⏳ Loading SQL.js (WebAssembly)..."),
        `❌ Failed to load SQL.js: ${err.message || err}`,
      ]);
    }
  };

  const run = async () => {
    const lines = [...output, `$ ${input}`];

    if (active === "xss") {
      setXssHtml(input);

      const hasScript = /<script\b/i.test(input);
      const hasHandler = /\bon\w+\s*=/i.test(input);
      const hasJsUrl = /javascript\s*:/i.test(input);

      if (hasScript || hasHandler || hasJsUrl) {
        lines.push("🔥 XSS payload detected! Rendered in sandboxed iframe below.");
        lines.push("⚡ The script executed in the victim's browser (sandboxed).");
        if (!solved.includes("xss")) setSolved([...solved, "xss"]);
      } else {
        lines.push("📄 HTML rendered in sandboxed iframe below.");
        lines.push("ℹ️ No executable script detected. Try adding a <script> tag.");
      }
    } else if (active === "sqli") {
      if (!dbRef.current || !sqlReady) {
        lines.push("⏳ Database is still initializing, please wait...");
        setOutput(lines);
        setInput("");
        return;
      }

      const template = "SELECT * FROM users WHERE username = 'admin' AND password = '";
      const fullQuery = template + input + "';";

      lines.push(`📝 Executing: ${fullQuery}`);

      try {
        const results = dbRef.current.exec(fullQuery);

        if (results.length > 0 && results[0].values.length > 0) {
          const columns = results[0].columns;
          const values = results[0].values;
          lines.push(`📊 Columns: ${columns.join(", ")}`);
          values.forEach((row: any[]) => {
            lines.push(`   ${row.join(" | ")}`);
          });

          const isInjection = /('?\s*--|['"]\s*OR\b|1\s*=\s*1|#|'.*')/i.test(input);
          if (isInjection) {
            lines.push("✅ SQL injection successful! Logged in as admin without password.");
            if (!solved.includes("sqli")) setSolved([...solved, "sqli"]);
          }
        } else {
          lines.push("❌ Login failed. No matching user found. Try a different injection.");
        }
      } catch (err: any) {
        lines.push(`❌ SQL Error: ${err.message}`);
      }
    } else if (active === "idor") {
      const match = input.match(/(\d+)/);
      if (match) {
        const id = match[1];
        try {
          const res = await fetch(`/api/sandbox/invoice?id=${id}`);
          const data = await res.json();

          if (data.error) {
            lines.push(`❌ ${data.error}`);
          } else {
            lines.push(`📄 Invoice #${data.id}`);
            lines.push(`   User: ${data.user}`);
            lines.push(`   Item: ${data.item}`);
            lines.push(`   Total: $${data.total.toFixed(2)}`);

            if (data.id !== 101) {
              lines.push("🔓 IDOR vulnerability! You accessed another user's invoice.");
              if (!solved.includes("idor")) setSolved([...solved, "idor"]);
            }
          }
        } catch {
          lines.push("❌ Network error. Is the API server running?");
        }
      } else {
        lines.push("ℹ️ Enter a URL like: /api/invoice?id=102  or just: 102");
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
              <p className="text-sm text-muted-foreground">Real vulnerability playground. Exploits actually work here.</p>
            </div>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto">
            {CHALLENGES.map(c => (
              <button key={c.id} onClick={() => { setActive(c.id); setOutput([]); setInput(""); setXssHtml(null); }}
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
                <Badge variant="warning" className="text-[10px]">Real Exploit</Badge>
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
                    <div key={i} className={`${
                      line.startsWith("🔥") || line.startsWith("✅") || line.startsWith("⚡") || line.startsWith("🔓") ? "text-emerald-400"
                        : line.startsWith("❌") ? "text-red-400"
                        : line.startsWith("$") ? "text-[#e4e4e7]"
                        : line.startsWith("⏳") ? "text-amber-400"
                        : "text-[#6b7280]"
                    }`}>
                      {line}
                    </div>
                  ))
                )}
              </div>

              {active === "xss" && xssHtml && (
                <div className="mt-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1.5">
                    🔒 Sandboxed Render ({'allow-scripts, allow-modals'}):
                  </div>
                  <iframe
                    sandbox="allow-scripts allow-modals"
                    srcDoc={xssHtml}
                    title="XSS Sandbox"
                    className="w-full rounded-lg border border-border bg-white"
                    style={{ height: 120 }}
                  />
                </div>
              )}

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
                This sandbox uses real exploits — XSS via a sandboxed iframe, real SQL injection via sql.js (in-browser SQLite),
                and a live IDOR API endpoint. Never test security exploits on real websites without explicit authorization.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
