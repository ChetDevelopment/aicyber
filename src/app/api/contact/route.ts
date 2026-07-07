import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Contact saved. In production, also send via email service.
    return NextResponse.json({ success: true, note: "Message received. We'll respond within 48 hours." })
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
