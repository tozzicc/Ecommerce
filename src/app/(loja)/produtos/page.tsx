import { ProductCard } from "@/components/products/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>;
}) {
    const { category, search } = await searchParams;

    const productsRaw = await prisma.product.findMany({
        where: {
            active: true,
            ...(category && { category: { slug: category } }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ],
            }),
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    const products = productsRaw.map((p: any) => ({
        ...p,
        price: Number(p.price)
    }));

    const categories = await prisma.category.findMany();

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col gap-10 md:flex-row">
                {/* Sidebar */}
                <aside className="w-full space-y-8 md:w-64">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Categorias</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a href="/produtos" className={`text-sm hover:underline ${!category ? 'font-bold' : ''}`}>
                                    Todos os Produtos
                                </a>
                            </li>
                            {categories.map((cat: any) => (
                                <li key={cat.id}>
                                    <a
                                        href={`/produtos?category=${cat.slug}`}
                                        className={`text-sm hover:underline ${category === cat.slug ? 'font-bold' : ''}`}
                                    >
                                        {cat.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-8 border-b pb-6">
                        <h1 className="text-3xl font-bold tracking-tighter uppercase">
                            {category ? (categories as any[]).find((c: any) => c.slug === category)?.name : "Nossa Coleção"}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                            <p className="text-gray-400">Nenhum produto encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
