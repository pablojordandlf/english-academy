// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    // Get raw body as text
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // Validate signature
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, message: "Missing signature or webhook secret" },
        { status: 401 }
      );
    }

    // Construct event
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle events (e.g., checkout.session.completed)
    switch (event.type) {
      case "checkout.session.completed":
        // Your logic here
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Webhook error" },
      { status: 400 }
    );
  }
}