import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function AdminProductEditPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let product = null;

    if (id !== "novo") {
        const productRaw = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        if (!productRaw) notFound();

        product = {
            ...productRaw,
            price: Number(productRaw.price)
        };
    }

    const categories = await prisma.category.findMany();

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-black">
                    {id === "novo" ? "Novo Produto" : "Editar Produto"}
                </h1>
                <p className="text-gray-500">
                    {id === "novo" ? "Cadastre um novo item no catálogo" : `Editando: ${product?.name}`}
                </p>
            </div>

            <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
                <ProductForm product={product} categories={categories} />
            </div>
        </div>
    );
}
