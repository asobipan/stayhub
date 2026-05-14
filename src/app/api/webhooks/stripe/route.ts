import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return NextResponse.json({ error: "No bookingId in metadata" }, { status: 400 });
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    });

    await db.payment.updateMany({
      where: { stripeSessionId: session.id },
      data: {
        status: "PAID",
        stripePaymentId: session.payment_intent as string ?? null,
      },
    });
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await db.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: "FAILED" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
