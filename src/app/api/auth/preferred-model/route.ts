import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get("cyberai_session")
    if (!cookie?.value) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const data = await verifySession(cookie.value)
    if (!data?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: data.id },
      select: { preferredModel: true },
    })
    return NextResponse.json({ model: user?.preferredModel || "gemini-2.0-flash" })
  } catch (error) {
    console.error("[PREFERRED_MODEL_GET]", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookie = request.cookies.get("cyberai_session")
    if (!cookie?.value) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const data = await verifySession(cookie.value)
    if (!data?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { model } = await request.json()
    if (!model) return NextResponse.json({ error: "Model required" }, { status: 400 })

    await prisma.user.update({
      where: { id: data.id },
      data: { preferredModel: model },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PREFERRED_MODEL_PATCH]", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
