import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { country, city, ip } = await request.json()
    await prisma.visitor.create({
      data: { country: country || null, city: city || null, ip: ip || null },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
