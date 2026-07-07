import { NextRequest, NextResponse } from "next/server"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password) return NextResponse.json({ ok: false }, { status: 400 })
    if (password !== ADMIN_PASSWORD) return NextResponse.json({ ok: false }, { status: 401 })
    return NextResponse.json({ ok: true, keys: { gemini: !!process.env.GEMINI_API_KEY, groq: !!process.env.GROQ_API_KEY } })
  } catch (error) {
    console.error("[ADMIN_CHECK]", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
