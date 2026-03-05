import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const { status } = await request.json();

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro ao atualizar pedido" },
            { status: error.status || 500 }
        );
    }
}
