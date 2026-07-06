"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Skull, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAY_KEY = "cyberai_darkweb_paid";
const PAY_RATE = 0.99;

export function DarkWebPaywall({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const paid = localStorage.getItem(PAY_KEY);
    if (paid) {
      const expires = parseInt(paid, 10);
      if (Date.now() < expires) setUnlocked(true);
      else localStorage.removeItem(PAY_KEY);
    }
  }, []);

  const buyAccess = () => {
    const expires = Date.now() + 86400000; // 24 hours
    localStorage.setItem(PAY_KEY, expires.toString());
    setUnlocked(true);
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600/20 to-red-600/20 border border-purple-500/30">
          <Skull className="h-10 w-10 text-purple-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Dark Web Research Lab</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Educational dark web simulator. Learn how the dark web works in a safe, controlled environment.
        </p>
        <div className="my-8 space-y-3 text-left">
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
        <Button onClick={buyAccess} size="lg" className="h-14 w-full rounded-xl text-base gap-2 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700">
          <Lock className="h-5 w-5" />
          Unlock 24h Access — ${PAY_RATE.toFixed(2)}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          (Simulated payment — no real charge. Free for educational use.)
        </p>
      </motion.div>
    </div>
  );
}
