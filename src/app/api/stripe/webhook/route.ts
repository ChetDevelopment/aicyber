import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getStripe() {
  const { default: Stripe } = require("stripe") as typeof import("stripe")
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-03-31" as any })
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature") || ""

  const stripe = getStripe()
  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const userId = session.metadata?.userId
      if (userId) {
        const subId = session.subscription as string
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPro: true,
            proSince: new Date(),
            stripeSubscriptionId: subId,
          },
        })
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object
      const customerId = sub.customer as string
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isPro: false, proSince: null, stripeSubscriptionId: null },
        })
      }
    }
  } catch (e) {
    console.error("[STRIPE_WEBHOOK]", e)
  }

  return NextResponse.json({ received: true })
}
