import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await requireAdmin();

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: { name: true, email: true }
                },
                items: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro ao buscar pedidos" },
            { status: error.status || 500 }
        );
    }
}
