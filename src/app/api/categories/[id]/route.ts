import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug: slugify(name),
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro ao atualizar categoria" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id } = await params;

        // Check if category has products
        const productsCount = await prisma.product.count({
            where: { categoryId: id },
        });

        if (productsCount > 0) {
            return NextResponse.json(
                { error: "Não é possível excluir uma categoria que possui produtos" },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro ao excluir categoria" },
            { status: 500 }
        );
    }
}
