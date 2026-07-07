import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.adminSetting.findMany()
    const map: Record<string, string> = {}
    settings.forEach(s => { map[s.id] = s.value })
    return NextResponse.json({ settings: map })
  } catch { return NextResponse.json({ settings: {} }) }
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
    if (data.email !== "admin@aiverses.app") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }

  try {
    const { id, value } = await request.json()
    await prisma.adminSetting.upsert({
      where: { id },
      update: { value },
      create: { id, value },
    })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }) }
}
