"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Shield, CheckCircle, ArrowRight, Skull, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    desc: "Get started with cybersecurity basics.",
    features: [
      "Local AI engine (30+ topics)",
      "Basic chat sessions",
      "CTF challenges",
      "Password checker",
      "Basic sandbox",
    ],
    cta: "Get Started",
    href: "/chat",
    popular: false,
    icon: Shield,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    desc: "Unlock the full CyberAI experience.",
    features: [
      "Everything in Free",
      "All AI models (Fast to Agent)",
      "🌑 Dark Web Research Lab",
      "Unlimited chat sessions",
      "Priority support",
      "No ads",
    ],
    cta: "Subscribe — $9.99/mo",
    href: "/api/stripe/checkout",
    popular: true,
    icon: Skull,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations and teams.",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Audit logs",
      "Dedicated support",
      "On-premise deployment",
      "SLA guarantee",
    ],
    cta: "Contact Us",
    href: "/contact",
    popular: false,
    icon: Zap,
  },
]

export default function PricingPage() {
  const { user, loading } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  async function handleCheckout() {
    if (!user) { window.location.href = "/login?redirect=/pricing"; return }
    setCheckoutLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {}
    setCheckoutLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-3xl font-bold sm:text-5xl">Go Pro — Unlock the Dark Web Lab</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start free. Upgrade when you&apos;re ready for the full experience.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md p-7 flex flex-col ${
                  plan.popular ? "border-purple-500/40 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/20" : "border-border"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 hover:bg-purple-600">
                    Most Popular
                  </Badge>
                )}

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className={`h-5 w-5 ${plan.popular ? "text-purple-500" : "text-primary"}`} />
                </div>

                <h3 className="text-lg font-semibold text-card-foreground">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-card-foreground">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className={`h-4 w-4 shrink-0 ${plan.popular ? "text-purple-500" : "text-green-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.name === "Pro" ? (
                  <Button
                    onClick={handleCheckout}
                    disabled={checkoutLoading || (!!user && user.isPro)}
                    className={`mt-8 w-full ${plan.popular ? "bg-purple-600 hover:bg-purple-700 text-white" : ""}`}
                  >
                    {checkoutLoading ? "Redirecting..." : user?.isPro ? "✓ Already Pro" : plan.cta}
                  </Button>
                ) : (
                  <Link href={plan.href} className="mt-8 block">
                    <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
