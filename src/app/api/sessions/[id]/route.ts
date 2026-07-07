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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const session = await prisma.tutorSession.findUnique({ where: { id } })
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (session.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    return NextResponse.json({ id: session.id, title: session.title, messages: session.messages, type: session.type, projectId: session.projectId })
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const session = await prisma.tutorSession.findUnique({ where: { id } })
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (session.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { title, messages } = await request.json()
    const data: Record<string, unknown> = {}
    if (title !== undefined) data.title = title
    if (messages !== undefined) data.messages = messages

    await prisma.tutorSession.update({ where: { id }, data })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  try {
    const session = await prisma.tutorSession.findUnique({ where: { id } })
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 })
    if (session.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    await prisma.tutorSession.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
