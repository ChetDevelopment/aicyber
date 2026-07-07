import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getUser(request: NextRequest) {
  const session = request.cookies.get("cyberai_session")
  if (!session?.value) return null
  try {
    const data = JSON.parse(Buffer.from(session.value, "base64").toString())
    return data as { id: string; email: string }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const user = getUser(request)
  if (!user) return NextResponse.json({ sessions: [] })

  try {
    const records = await prisma.tutorSession.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, type: true, projectId: true, messages: true, updatedAt: true },
    })
    return NextResponse.json({
      sessions: records.map(r => ({ id: r.id, title: r.title, type: r.type, projectId: r.projectId, messages: r.messages, updatedAt: r.updatedAt.toISOString() })),
    })
  } catch {
    return NextResponse.json({ sessions: [] })
  }
}

export async function POST(request: NextRequest) {
  const user = getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { title, messages, type, projectId } = await request.json()
    const record = await prisma.tutorSession.create({
      data: {
        userId: user.id,
        title: title || "New chat",
        messages: messages || [],
        type: type || "chat",
        projectId: projectId || null,
      },
    })
    return NextResponse.json({ id: record.id, title: record.title })
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
