import type { Metadata } from "next"
import { Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — CyberAI Tutor",
  description: "Terms and conditions for using CyberAI Tutor.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">CyberAI Tutor</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using CyberAI Tutor, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>CyberAI Tutor is an AI-powered educational platform that teaches cybersecurity concepts through conversational AI. The service is provided &quot;as is&quot; and is intended for educational purposes only.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Educational Purpose</h2>
            <p className="mb-2">CyberAI Tutor is designed to teach defensive cybersecurity concepts. You agree not to use the service to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Learn how to perform malicious hacking or attacks</li>
              <li>Generate instructions for illegal activities</li>
              <li>Test or exploit vulnerabilities on systems you do not own</li>
              <li>Harass, threaten, or harm others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. User Responsibilities</h2>
            <p className="mb-2">As a user, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the service responsibly and ethically</li>
              <li>Not attempt to bypass any safety guardrails</li>
              <li>Not submit harmful or abusive content</li>
              <li>Not use automated bots or scripts to interact with the AI</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Limitation of Liability</h2>
            <p>CyberAI Tutor provides information for educational purposes. We make no guarantees about the accuracy, completeness, or applicability of the information provided. Always verify critical security information with official sources.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Users will be notified of material changes via the website or email.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Contact</h2>
            <p>For questions about these terms, visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
