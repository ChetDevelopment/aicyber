import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email, name: name || email.split("@")[0], passwordHash, provider: "local" },
    })

    const token = createSession({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, provider: "local" })
    const response = NextResponse.json({ success: true, redirect: "/" })
    response.cookies.set("cyberai_session", token, { path: "/", httpOnly: false, sameSite: "lax", maxAge: 60 * 60 * 24 * 7 })
    return response
  } catch (error) {
    console.error("[REGISTER]", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
