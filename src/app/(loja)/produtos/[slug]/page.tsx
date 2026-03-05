import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/products/AddToCartButton";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const productRaw = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    });

    if (!productRaw) {
        notFound();
    }

    const product = {
        ...productRaw,
        price: Number(productRaw.price)
    };

    return (
        <div className="container mx-auto px-4 py-20">
            <Button asChild variant="ghost" className="mb-8 pl-0 text-gray-500 hover:text-black">
                <Link href="/produtos">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para produtos
                </Link>
            </Button>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-2xl">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.slice(1).map((img: string, i: number) => (
                            <div key={i} className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
                                <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col">
                    <Badge className="w-fit mb-4">{product.category.name}</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-black uppercase">{product.name}</h1>
                    <p className="mt-8 text-2xl font-bold text-black">{formatPrice(product.price)}</p>

                    <div className="mt-8 space-y-6 border-y py-8">
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>

                        <AddToCartButton product={product} />

                        {product.stock <= 5 && product.stock > 0 && (
                            <p className="text-sm font-semibold text-orange-600">Restam apenas {product.stock} unidades!</p>
                        )}
                        {product.stock === 0 && (
                            <p className="text-sm font-semibold text-red-600">Produto indisponível no momento.</p>
                        )}
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center text-sm text-gray-600">
                            <Truck className="mr-3 h-5 w-5" />
                            <span>Frete grátis para todo o Brasil em compras acima de R$ 299</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <ShieldCheck className="mr-3 h-5 w-5" />
                            <span>Compra 100% segura com garantia de 30 dias</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <RotateCcw className="mr-3 h-5 w-5" />
                            <span>Primeira troca grátis e descomplicada</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
