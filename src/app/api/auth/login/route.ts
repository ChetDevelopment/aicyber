import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

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
    console.error("[LOGIN]", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
