import { prisma } from "@/lib/prisma";
import { getSession, requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { name, description, price, stock, slug, categoryId, images, active } = body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                slug,
                categoryId,
                images,
                active,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/products error:", error);
        return NextResponse.json(
            { error: error.message || "Erro ao criar produto" },
            { status: error.status || 500 }
        );
    }
}
