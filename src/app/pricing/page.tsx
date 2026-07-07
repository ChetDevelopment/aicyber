"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Shield, Bot, Lock, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const FEATURES = [
  { icon: Bot, title: "5 AI Models", desc: "Gemini Flash/Pro/Lite + Llama Fast/Balanced" },
  { icon: Shield, title: "30+ Cybersecurity Topics", desc: "From passwords to zero-days" },
  { icon: Lock, title: "Works Offline", desc: "Local AI engine, no API key needed" },
  { icon: Sparkles, title: "CTF Challenges", desc: "6 interactive puzzles" },
  { icon: Check, title: "Unlimited Chats", desc: "No limits, no restrictions" },
  { icon: ArrowRight, title: "Always Free", desc: "No credit card required" },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl font-bold sm:text-6xl">
            Completely{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Free</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            CyberAI Tutor is and always will be free. No subscriptions, no hidden fees.
          </p>
        </motion.div>

        <div className="mx-auto max-w-lg">
          <Card className="border-primary/30 shadow-lg shadow-primary/5">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge className="mb-4">Free Forever</Badge>
                <p className="text-5xl font-bold text-foreground">$0</p>
                <p className="text-sm text-muted-foreground mt-2">Everything included</p>
              </div>
              <div className="space-y-4 mb-8">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{f.title}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Link href="/chat">
                <Button size="lg" className="w-full h-14 rounded-xl text-base">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
