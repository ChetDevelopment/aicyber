import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

async function getUser(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return null
  try { return await verifySession(cookie.value) } catch { return null }
}

export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ solved: [] })
  try {
    const records = await prisma.ctfProgress.findMany({ where: { userId: user.id }, select: { challengeId: true } })
    return NextResponse.json({ solved: records.map(r => r.challengeId) })
  } catch { return NextResponse.json({ solved: [] }) }
}

export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { challengeId } = await request.json()
  if (challengeId === undefined) return NextResponse.json({ error: "challengeId required" }, { status: 400 })

  try {
    await prisma.ctfProgress.upsert({
      where: { userId_challengeId: { userId: user.id, challengeId } },
      update: {},
      create: { userId: user.id, challengeId },
    })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }) }
}
