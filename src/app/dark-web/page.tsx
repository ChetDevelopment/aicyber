"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Skull, Shield, Lock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Exit
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Skull className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">DarkNet Market</h1>
              <Badge variant="warning" className="text-[10px]">Educational</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Tor hidden service — .onion — Educational purposes only</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
            <Shield className="h-3.5 w-3.5" /> Connected via Tor
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search listings..." autoFocus
              className="w-full rounded-xl border border-input bg-background px-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="space-y-3">
          {filtered.map(item => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelected(selected === item.id ? null : item.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                selected === item.id
                  ? "border-primary/40 bg-muted/80"
                  : "border-border bg-card hover:border-primary/20 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-card-foreground">{item.name}</h3>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                  {selected === item.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Seller: <span className="text-card-foreground">{item.seller}</span></span>
                        <span>Rating: <span className="text-amber-500">{'★'.repeat(Math.floor(item.rating))} ({item.rating})</span></span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1.5">
                          <Lock className="h-3.5 w-3.5" /> Purchase with BTC
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" /> View Details
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
                <span className="text-sm font-bold text-primary shrink-0">{item.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            <p className="text-xs text-muted-foreground">
              This is an educational simulation. No real transactions occur. Dark web research should only be conducted ethically and legally.
              All listings are fictional and for learning purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
