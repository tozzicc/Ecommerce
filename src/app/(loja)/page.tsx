import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
    const featuredProductsRaw = await prisma.product.findMany({
        where: { active: true },
        take: 8,
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    const featuredProducts = featuredProductsRaw.map((p: any) => ({
        ...p,
        price: Number(p.price)
    }));

    return (
        <div className="flex flex-col gap-16 pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full overflow-hidden bg-gray-900">
                <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
                    alt="Hero"
                    fill
                    priority
                    className="object-cover opacity-60"
                />
                <div className="container relative mx-auto flex h-full flex-col justify-center px-4 text-white">
                    <h1 className="max-w-2xl text-5xl font-extrabold tracking-tighter md:text-7xl">
                        SINTA O ESTILO EM CADA DETALHE <span className="text-gray-400">.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-lg text-gray-200">
                        Descubra nossa coleção exclusiva de moda minimalista com materiais de alta qualidade e design atemporal.
                    </p>
                    <div className="mt-10 flex gap-4">
                        <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-gray-200">
                            <Link href="/produtos">Shop Now</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full border-white text-white hover:bg-white hover:text-black">
                            <Link href="/produtos?category=camisetas">Coleção 2026</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="flex items-end justify-between">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-black uppercase">
                            DESTAQUES <span className="text-gray-400">.</span>
                        </h2>
                        <p className="text-gray-500">Nossa curadoria especial para você</p>
                    </div>
                    <Button variant="link" asChild className="text-black font-semibold">
                        <Link href="/produtos">Ver todos →</Link>
                    </Button>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                    {featuredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Categories Grid */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter uppercase text-black">CATEGORIAS EM FOCO</h2>
                </div>
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative h-96 group overflow-hidden">
                        <Image src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800" alt="Camisetas" fill className="object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="text-center">
                                <h3 className="text-white text-3xl font-bold">CAMISETAS</h3>
                                <Button asChild variant="secondary" className="mt-4 rounded-full"><Link href="/produtos?category=camisetas">Explorar</Link></Button>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-96 group overflow-hidden">
                        <Image src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" alt="Tenis" fill className="object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="text-center">
                                <h3 className="text-white text-3xl font-bold">TÊNIS</h3>
                                <Button asChild variant="secondary" className="mt-4 rounded-full"><Link href="/produtos?category=tenis">Explorar</Link></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
