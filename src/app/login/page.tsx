import { Suspense } from "react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
