import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const sig = (await headers()).get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 }
        );
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        // Create the order in the database
        // Note: In a real app, you'd fetch the cart items from the session metadata or a pending order
        // For this simple version, we'll assume the session has metadata about the items or we fetch them

        const userId = session.metadata?.userId;

        if (userId) {
            // Update order status or create order
            // We'll implement order creation here for simplicity
            // In a production app, you might create the order as PENDING before checkout

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

            await prisma.order.create({
                data: {
                    userId,
                    total: (session.amount_total || 0) / 100,
                    status: "PAID",
                    stripeSessionId: session.id,
                    shippingAddress: (session as any).shipping_details || {},
                    items: {
                        create: lineItems.data.map((item) => ({
                            // We need the product ID. Metadata on line items is helpful.
                            // For this scaffold, we'll use a placeholder or better logic if we had stored the order first.
                            productId: "placeholder", // This needs logic to map Stripe products back to DB products
                            quantity: item.quantity || 1,
                            price: (item.amount_total || 0) / 100 / (item.quantity || 1),
                        })),
                    },
                },
            });
        }
    }

    return NextResponse.json({ received: true });
}
