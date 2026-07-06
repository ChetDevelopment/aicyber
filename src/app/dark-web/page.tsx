"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Skull, Shield, Lock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DarkWebPaywall } from "@/components/paywall";
import Link from "next/link";

const LISTINGS = [
  { id: 1, name: "Secure Drop Server", price: "$240", desc: "Whistleblower submission server. No logs. Encrypted.", category: "Hosting", seller: "AnonOps", rating: 4.8 },
  { id: 2, name: "Pen Test Reports 2026", price: "$85", desc: "CTF writeups, red team tools, exploit PoCs", category: "Documents", seller: "PacketWizard", rating: 4.6 },
  { id: 3, name: "Zero-Day Research", price: "$1,200", desc: "Proof-of-concept for unpatched RCE in Apache 2.8", category: "Exploits", seller: "VulnHunter", rating: 4.9 },
  { id: 4, name: "Encrypted Messaging Guide", price: "$15", desc: "PGP, OTR, Signal setup guide for activists", category: "Guides", seller: "CryptoAnon", rating: 4.7 },
  { id: 5, name: "Burner Phone OS", price: "$60", desc: "Privacy-focused mobile OS. Pre-configured VPN + Tor", category: "Hardware", seller: "DarkTech", rating: 4.5 },
  { id: 6, name: "Network Mapping Toolkit", price: "$45", desc: "Nmap scripts, masscan configs, OSINT templates", category: "Tools", seller: "ReconKing", rating: 4.4 },
];

const CATEGORIES = ["All", "Hosting", "Documents", "Exploits", "Guides", "Hardware", "Tools"];

export default function DarkWeb() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = LISTINGS.filter(l => {
    if (category !== "All" && l.category !== category) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.desc.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DarkWebPaywall>
      <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
        <div className="mx-auto max-w-5xl px-6 py-8" style={{ color: "#c4b5fd" }}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm transition-colors mb-6" style={{ color: "#6b7280" }}>
            <ArrowLeft className="h-4 w-4" /> Exit
          </Link>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Skull className="h-6 w-6" style={{ color: "#a855f7" }} />
                <h1 className="text-xl font-bold" style={{ color: "#e4e4e7" }}>DarkNet Market</h1>
                <Badge variant="warning" className="text-[10px]">Educational Simulation</Badge>
              </div>
              <p className="text-xs" style={{ color: "#6b7280" }}>Tor hidden service — .onion — Educational purposes only</p>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
              <Shield className="h-3.5 w-3.5" /> Connected via Tor
            </div>
          </div>

          <div className="mb-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "#6b7280" }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search listings..." autoFocus
                className="w-full rounded-xl border px-9 py-2.5 text-sm outline-none"
                style={{ background: "#1a1a2e", borderColor: "#2d2d4a", color: "#e4e4e7" }}
              />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="rounded-lg border px-3 py-1.5 text-xs transition-all"
                style={{
                  background: category === c ? "#a855f7" : "transparent",
                  borderColor: category === c ? "#a855f7" : "#2d2d4a",
                  color: category === c ? "white" : "#6b7280",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(selected === item.id ? null : item.id)}
                className="cursor-pointer rounded-xl border p-4 transition-all"
                style={{
                  background: selected === item.id ? "#1e1e3a" : "#12122a",
                  borderColor: selected === item.id ? "#a855f740" : "#2d2d4a",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold" style={{ color: "#e4e4e7" }}>{item.name}</h3>
                      <span className="text-[10px] rounded-full border px-1.5 py-0" style={{ borderColor: "#2d2d4a", color: "#6b7280" }}>{item.category}</span>
                    </div>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{item.desc}</p>
                    {selected === item.id && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
                        <div className="flex items-center gap-4 text-xs" style={{ color: "#6b7280" }}>
                          <span>Seller: {item.seller}</span>
                          <span>Rating: {'★'.repeat(Math.floor(item.rating))} ({item.rating})</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all" style={{ background: "#a855f7" }}>
                            <Lock className="h-3 w-3" /> Purchase with BTC
                          </button>
                          <button className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all" style={{ borderColor: "#2d2d4a", color: "#6b7280" }}>
                            <ExternalLink className="h-3 w-3" /> View Details
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <span className="text-sm font-bold shrink-0 ml-4" style={{ color: "#a855f7" }}>{item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs" style={{ color: "#4b5563" }}>
            ⚠ This is an educational simulation. No real transactions occur. Dark web research should only be conducted ethically and legally.
          </p>
        </div>
      </div>
    </DarkWebPaywall>
  );
}
