import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return NextResponse.json({ user: null })

  try {
    const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
    if (!data.email) return NextResponse.json({ user: null })

    // Return basic user info from cookie immediately (no DB needed)
    const userBase = {
      id: data.id,
      email: data.email,
      name: data.name || data.email.split("@")[0],
      avatarUrl: data.avatarUrl || null,
      provider: data.provider || "local",
      isPro: false,
      proSince: null as string | null,
    }

    // Try to get isPro from DB with a short timeout — non-blocking
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const dbUser = await Promise.race([
        prisma.user.findUnique({
          where: { id: data.id },
          select: { isPro: true, proSince: true },
        }),
        new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 3000)
        }),
      ])
      clearTimeout(timeout)
      if (dbUser) {
        userBase.isPro = dbUser.isPro
        userBase.proSince = dbUser.proSince?.toISOString() || null
      }
    } catch {
      // DB unavailable — continue without pro status
    }

    return NextResponse.json({ user: userBase })
  } catch {
    return NextResponse.json({ user: null })
  }
}
