import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get("cyberai_session")
    if (!cookie?.value) return NextResponse.json({ user: null })

    const data = await verifySession(cookie.value)
    if (!data?.email) return NextResponse.json({ user: null })

    const userBase = {
      id: data.id,
      email: data.email,
      name: data.name || data.email.split("@")[0],
      avatarUrl: data.avatarUrl || null,
      provider: data.provider || "local",
      isPro: false,
      proSince: null as string | null,
    }

    try {
      const dbUser = await Promise.race([
        prisma.user.findUnique({
          where: { id: data.id },
          select: { isPro: true, proSince: true, preferredModel: true },
        }),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
      ])
      if (dbUser) {
        userBase.isPro = dbUser.isPro
        userBase.proSince = dbUser.proSince?.toISOString() || null
        ;(userBase as any).preferredModel = dbUser.preferredModel
      }
    } catch {
      console.warn("[AUTH] DB unavailable, returning basic user")
    }

    return NextResponse.json({ user: userBase })
  } catch (error) {
    console.error("[AUTH/ME]", error)
    return NextResponse.json({ user: null })
  }
}
