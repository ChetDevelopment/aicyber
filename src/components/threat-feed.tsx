"use client";

import { useState, useEffect } from "react";

interface Threat {
  id: number;
  type: string;
  source: string;
  city: string;
  timestamp: string;
  severity: string;
}

export function ThreatFeed() {
  const [threats, setThreats] = useState<Threat[]>([]);

  useEffect(() => {
    const fetchThreats = () => {
      fetch("/api/threats")
        .then(r => r.json())
        .then(d => setThreats(d.threats || []))
        .catch(() => {});
    };
    fetchThreats();
    const interval = setInterval(fetchThreats, 12000);
    return () => clearInterval(interval);
  }, []);

  if (threats.length === 0) return null;

  return (
    <div className="w-full overflow-hidden bg-background border-t border-border py-2">
      <div className="flex items-center gap-3 animate-marquee whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 shrink-0 px-2">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          LIVE THREAT FEED
        </span>
        {threats.map(t => (
          <span key={t.id} className="inline-flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            <span className={`h-1.5 w-1.5 rounded-full ${
              t.severity === "critical" ? "bg-red-500" :
              t.severity === "high" ? "bg-orange-500" :
              t.severity === "medium" ? "bg-yellow-500" : "bg-blue-500"
            }`} />
            [{new Date(t.timestamp).toLocaleTimeString()}] {t.type} from {t.city}
            <span className="text-muted-foreground/50">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
