"use client";

import { useEffect, useState, useRef } from "react";
import { Shield, AlertTriangle, Skull, Zap, Globe, Bug } from "lucide-react";

const THREATS = [
  { icon: AlertTriangle, text: "Critical: SQL injection attempt detected on /api/login from 185.220.101.x", color: "text-red-400" },
  { icon: Skull, text: "Ransomware variant 'LockBit 4.0' spreading in APAC region", color: "text-red-500" },
  { icon: Zap, text: "DDoS attack mitigated — 2.4 Tbps peak, target: financial sector", color: "text-amber-400" },
  { icon: Globe, text: "New zero-day in Apache Log4j being actively exploited", color: "text-blue-400" },
  { icon: Bug, text: "Phishing campaign impersonating Microsoft 365 — 12k domains registered", color: "text-purple-400" },
  { icon: Shield, text: "CVE-2026-0011: Critical RCE in Kubernetes — patch available", color: "text-emerald-400" },
  { icon: AlertTriangle, text: "Brute force attack on SSH — 45k attempts from 3 IPs blocked", color: "text-orange-400" },
  { icon: Skull, text: "Credentials dump detected — 2M records on dark web forums", color: "text-red-500" },
  { icon: Zap, text: "IoT botnet 'Mirai-Gen' targeting routers in Europe", color: "text-yellow-400" },
  { icon: Globe, text: "Supply chain attack: npm package compromised, 500k downloads", color: "text-cyan-400" },
  { icon: Shield, text: "Zero-day in iOS Mail app — patch released in iOS 19.3", color: "text-green-400" },
  { icon: Bug, text: "New jailbreak technique for AI models bypasses safety guardrails", color: "text-pink-400" },
  { icon: AlertTriangle, text: "DNS poisoning attack targeted at crypto exchanges", color: "text-rose-400" },
  { icon: Skull, text: "Ransomware group 'BlackCat' claims insurance provider breach", color: "text-red-500" },
  { icon: Zap, text: "DDoS-for-hire service taken down by international task force", color: "text-lime-400" },
];

export function ThreatFeed() {
  const [items, setItems] = useState(THREATS.slice(0, 5));
  const offsetRef = useRef(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const next = [...prev.slice(1)];
        next.push(THREATS[offsetRef.current % THREATS.length]);
        offsetRef.current += 1;
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden border-t border-border bg-muted/80">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">LIVE</span>
        </div>
        <div className="flex flex-1 gap-6 overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex shrink-0 items-center gap-2 animate-marquee" style={{ animation: `marquee 20s linear infinite` }}>
                <Icon className={`h-3 w-3 shrink-0 ${item.color}`} />
                <span className="whitespace-nowrap text-[11px] text-muted-foreground">{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
