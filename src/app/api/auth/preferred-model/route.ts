import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

async function getUser(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return null
  return verifySession(cookie.value)
}

export async function GET(request: NextRequest) {
  const data = await getUser(request)
  if (!data) return NextResponse.json({ model: "gemini-2.0-flash" })
  try {
    const user = await prisma.user.findUnique({ where: { id: data.id }, select: { preferredModel: true } })
    return NextResponse.json({ model: user?.preferredModel || "gemini-2.0-flash" })
  } catch { return NextResponse.json({ model: "gemini-2.0-flash" }) }
}

export async function PATCH(request: NextRequest) {
  const data = await getUser(request)
  if (!data) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { model } = await request.json()
  if (!model) return NextResponse.json({ error: "Model required" }, { status: 400 })
  try {
    await prisma.user.update({ where: { id: data.id }, data: { preferredModel: model } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }) }
}
