"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Send, Mail, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const channels = [
  { icon: MessageSquare, title: "GitHub Issues", desc: "Report bugs or request features", action: "Open GitHub", href: "https://github.com" },
  { icon: Mail, title: "Email", desc: "For privacy and legal inquiries", action: "Send Email", href: "mailto:hello@cyberai-tutor.app" },
  { icon: Clock, title: "Response Time", desc: "We typically respond within 48 hours", action: null, href: null },
]

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      if (res.ok) setSent(true)
    } catch {}
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">Contact</Badge>
          <h1 className="text-3xl font-bold sm:text-5xl">Get in touch</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Have a question, suggestion, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {channels.map((ch, i) => {
            const Icon = ch.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-1">{ch.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{ch.desc}</p>
                    {ch.href && (
                      <a href={ch.href} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">{ch.action} &rarr;</Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-card-foreground mb-6">Send us a message</h2>
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                    <Send className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-base font-semibold text-card-foreground">Message sent!</p>
                  <p className="mt-1 text-sm text-muted-foreground">We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-medium text-card-foreground">Name</label>
                      <input id="name" value={name} onChange={e => setName(e.target.value)} required
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your name" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-medium text-card-foreground">Email</label>
                      <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="you@example.com" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-medium text-card-foreground">Message</label>
                    <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder="How can we help?" />
                  </div>
                  <Button type="submit" disabled={sending || !name.trim() || !email.trim() || !message.trim()}>
                    {sending ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
