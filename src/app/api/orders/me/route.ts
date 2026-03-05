import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: session.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("GET /api/orders/me error:", error);
        return NextResponse.json(
            { error: "Erro ao buscar pedidos" },
            { status: 500 }
        );
    }
}
