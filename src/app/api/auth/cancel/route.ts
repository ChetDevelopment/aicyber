import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getStripe() {
  const { default: Stripe } = require("stripe") as typeof import("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-03-31" as any })
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("cyberai_session")
  if (!cookie?.value) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
    const user = await prisma.user.findUnique({ where: { id: data.id } })
    if (!user?.stripeSubscriptionId) return NextResponse.json({ error: "No subscription" }, { status: 400 })

    const stripe = getStripe()
    const sub = await stripe.subscriptions.update(user.stripeSubscriptionId, { cancel_at_period_end: true })
    return NextResponse.json({ ok: true, endsAt: new Date((sub as any).current_period_end * 1000).toISOString() })
  } catch {
    return NextResponse.json({ error: "Cancel failed" }, { status: 500 })
  }
}
