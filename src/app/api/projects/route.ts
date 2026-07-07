import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

async function getUser(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return null
  try { return await verifySession(cookie.value) }
  catch { return null }
}

export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ projects: [] })
  try {
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { sessions: true } } },
    })
    return NextResponse.json({
      projects: projects.map(p => ({ id: p.id, name: p.name, sessionCount: p._count.sessions, createdAt: p.createdAt.toISOString() })),
    })
  } catch { return NextResponse.json({ projects: [] }) }
}

export async function POST(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { name } = await request.json()
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 })
  try {
    const project = await prisma.project.create({ data: { userId: user.id, name: name.trim() } })
    return NextResponse.json({ id: project.id, name: project.name })
  } catch { return NextResponse.json({ error: "Failed to create" }, { status: 500 }) }
}
