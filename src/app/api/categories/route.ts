import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("GET /api/categories error:", error);
        return NextResponse.json(
            { error: "Erro ao buscar categorias" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requireAdmin();
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug: slugify(name),
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Erro ao criar categoria" },
            { status: 500 }
        );
    }
}
