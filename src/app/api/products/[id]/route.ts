import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id: identifier } = await params;

        // Try finding by ID first
        let product = await prisma.product.findUnique({
            where: { id: identifier },
            include: { category: true },
        });

        // If not found by ID, try finding by Slug
        if (!product) {
            product = await prisma.product.findUnique({
                where: { slug: identifier },
                include: { category: true },
            });
        }

        if (!product) {
            return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("GET /api/products/[id] error:", error);
        return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const body = await request.json();

        const product = await prisma.product.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(product);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro ao atualizar produto" },
            { status: error.status || 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro ao excluir produto" },
            { status: error.status || 500 }
        );
    }
}
