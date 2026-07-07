import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getUser(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return null
  try { return JSON.parse(Buffer.from(cookie.value, "base64").toString()) as { id: string; email: string } }
  catch { return null }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { projectId } = await request.json()

  try {
    const session = await prisma.tutorSession.findUnique({ where: { id } })
    if (!session || session.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    await prisma.tutorSession.update({ where: { id }, data: { projectId: projectId || null } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }) }
}
