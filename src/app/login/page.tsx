import { Suspense } from "react"
import LoginClient from "./login-client"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>}>
      <LoginClient />
    </Suspense>
  )
}
