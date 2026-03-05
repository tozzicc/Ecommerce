import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { items } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
        }

        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: item.name,
                        images: item.images,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/carrinho`,
            customer_email: session.email,
            metadata: {
                userId: session.id,
            },
        });

        return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });
    } catch (error) {
        console.error("POST /api/checkout error:", error);
        return NextResponse.json(
            { error: "Erro ao criar sessão de checkout" },
            { status: 500 }
        );
    }
}
