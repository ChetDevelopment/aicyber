import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getStripe() {
  const { default: Stripe } = require("stripe") as typeof import("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-03-31" as any })
}

export async function POST(request: Request) {
  const cookie = request.headers.get("cookie") || ""
  const match = cookie.match(/cyberai_session=([^;]+)/)
  if (!match) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = JSON.parse(Buffer.from(match[1], "base64").toString())
    const user = await prisma.user.findUnique({ where: { id: data.id } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const stripe = getStripe()
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } })
      customerId = customer.id
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      metadata: { userId: user.id },
      success_url: `${process.env.SITE_URL || "https://cyber.aiverses.app"}/dark-web?upgraded=true`,
      cancel_url: `${process.env.SITE_URL || "https://cyber.aiverses.app"}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error("[STRIPE_CHECKOUT]", e)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
