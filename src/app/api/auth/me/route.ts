import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return NextResponse.json({ user: null })

  try {
    const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
    const user = await prisma.user.findUnique({
      where: { id: data.id },
      select: { id: true, email: true, name: true, avatarUrl: true, isPro: true, proSince: true },
    })
    if (!user) return NextResponse.json({ user: null })
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        isPro: user.isPro,
        proSince: user.proSince?.toISOString() || null,
      },
    })
  } catch {
    return NextResponse.json({ user: null })
  }
}
