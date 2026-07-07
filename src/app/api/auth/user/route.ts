import { NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get("cyberai_session")
    if (!cookie?.value) return NextResponse.json({ user: null })

    const data = await verifySession(cookie.value)
    if (!data?.email) return NextResponse.json({ user: null })

    return NextResponse.json({
      user: {
        id: data.id,
        email: data.email,
        name: data.name || data.email.split("@")[0],
        avatarUrl: data.avatarUrl || null,
        provider: data.provider || "local",
      },
    })
  } catch (error) {
    console.error("[AUTH/USER]", error)
    return NextResponse.json({ user: null })
  }
}
