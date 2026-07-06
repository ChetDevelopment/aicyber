import type { Metadata } from "next"
import { Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy — CyberAI Tutor",
  description: "How CyberAI Tutor collects, uses, and protects your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">CyberAI Tutor</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p className="mb-2">We collect minimal information to provide and improve the CyberAI Tutor service:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Chat messages</strong> — When you use the AI tutor, your messages are processed to generate responses. If you are signed in, chat history is stored to sync across devices.</li>
              <li><strong className="text-foreground">Account data</strong> — If you create an account, we store your email address and display name.</li>
              <li><strong className="text-foreground">Usage data</strong> — Anonymous analytics about which features are used, page views, and session duration.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To generate AI-powered responses to your cybersecurity questions</li>
              <li>To sync your chat sessions across devices when signed in</li>
              <li>To improve the quality of our AI tutor responses</li>
              <li>To monitor and prevent abuse of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
            <p className="mb-2">Your data is stored securely using industry-standard encryption. Chat messages are stored in a PostgreSQL database. Local chat sessions (when not signed in) are stored only in your browser&apos;s localStorage and are not transmitted to our servers.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p className="mb-2">CyberAI Tutor uses the following third-party AI providers when API keys are configured:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-foreground">Google Gemini API</strong> — AI model provider</li>
              <li><strong className="text-foreground">Groq</strong> — AI inference provider</li>
            </ul>
            <p className="mt-2">When these are not configured, all processing is done locally on the server using our built-in AI engine. No data is sent to third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access your personal data</li>
              <li>Delete your account and associated data</li>
              <li>Export your chat history</li>
              <li>Opt out of analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Contact</h2>
            <p>For privacy-related inquiries, contact us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
