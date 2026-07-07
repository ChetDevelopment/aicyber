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
  const { name } = await request.json()
  try {
    const p = await prisma.project.findUnique({ where: { id } })
    if (!p || p.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    await prisma.project.update({ where: { id }, data: { name } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }) }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUser(request)
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  try {
    const p = await prisma.project.findUnique({ where: { id } })
    if (!p || p.userId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }) }
}
