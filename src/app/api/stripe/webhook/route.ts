import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

let stripe: any = null
function getStripe() {
  if (!stripe) {
    const Stripe = require("stripe")
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "")
  }
  return stripe
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
      if (!userId) {
        console.error("[STRIPE] No userId in session metadata")
        return NextResponse.json({ error: "Missing userId" }, { status: 400 })
      }
      const subId = session.subscription as string
      await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: true,
          proSince: new Date(),
          stripeSubscriptionId: subId,
        },
      })
      console.log(`[STRIPE] Pro activated for user ${userId}`)
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
        console.log(`[STRIPE] Pro deactivated for user ${user.id}`)
      }
    }
  } catch (e) {
    console.error("[STRIPE_WEBHOOK] DB update failed, returning 500 for retry:", e)
    return NextResponse.json({ error: "DB update failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
