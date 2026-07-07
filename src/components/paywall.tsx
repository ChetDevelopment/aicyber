"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Skull, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function DarkWebPaywall() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20">
          <Skull className="h-10 w-10 text-primary" />
        </div>
        <Badge variant="warning" className="mb-4">Pro Feature</Badge>
        <h1 className="text-2xl font-bold text-foreground">Dark Web Research Lab</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          Explore a simulated .onion marketplace. Learn how the dark web works in a safe, controlled environment.
          Available exclusively with CyberAI Pro.
        </p>
        <div className="my-8 space-y-3 text-left max-w-sm mx-auto">
          {[
            "Simulated .onion marketplace interface",
            "Educational content about Tor and encryption",
            "Realistic dark web browsing experience",
            "No actual dark web access — 100% safe",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
        <Link href="/pricing">
          <Button size="lg" className="h-14 w-full rounded-xl text-base gap-2">
            <Sparkles className="h-5 w-5" />
            Upgrade to Pro — $9.99/mo
          </Button>
        </Link>
        <p className="mt-3 text-xs text-muted-foreground">
          Unlock the Dark Web Lab and all AI models.
        </p>
      </motion.div>
    </div>
  );
}
