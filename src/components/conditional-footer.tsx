"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname === "/chat" || pathname === "/owner") return null
  return <Footer />
}
