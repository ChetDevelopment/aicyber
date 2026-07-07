import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return NextResponse.json({ user: null })

  try {
    const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
    if (!data.email) return NextResponse.json({ user: null })

    // Try to get isPro from DB, but don't fail if DB is unavailable
    let isPro = false
    let proSince: string | null = null
    try {
      const user = await prisma.user.findUnique({
        where: { id: data.id },
        select: { isPro: true, proSince: true },
      })
      if (user) {
        isPro = user.isPro
        proSince = user.proSince?.toISOString() || null
      }
    } catch {
      // DB unavailable — continue without pro status
    }

    return NextResponse.json({
      user: {
        id: data.id,
        email: data.email,
        name: data.name || data.email.split("@")[0],
        avatarUrl: data.avatarUrl || null,
        provider: data.provider || "local",
        isPro,
        proSince,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
