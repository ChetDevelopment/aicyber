import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email,
        name: name || email.split("@")[0],
        passwordHash,
        provider: "local",
      },
    })

    const session = { id: user.id, email: user.email, name: user.name, avatarUrl: null, provider: "local" }
    const encoded = Buffer.from(JSON.stringify(session)).toString("base64")

    const response = NextResponse.json({ success: true, redirect: "/" })
    response.cookies.set("cyberai_session", encoded, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    console.error("[REGISTER]", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
