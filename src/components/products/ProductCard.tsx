"use client";

import { useCart } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

interface ProductCardProps {
    product: any;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product);
        toast.success(`${product.name} adicionado ao carrinho!`);
    };

    return (
        <Card className="group relative h-full overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
            <Link href={`/produtos/${product.slug}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center space-x-2 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                    {product.stock <= 5 && product.stock > 0 && (
                        <Badge className="absolute left-2 top-2 bg-orange-500 text-white">Últimas unidades</Badge>
                    )}
                    {product.stock === 0 && (
                        <Badge className="absolute left-2 top-2 bg-red-500 text-white">Esgotado</Badge>
                    )}
                </div>
                <CardContent className="p-4">
                    <p className="text-xs uppercase tracking-widest text-gray-400">{product.category.name}</p>
                    <h3 className="mt-1 font-semibold leading-tight text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="mt-2 text-lg font-bold text-black">{formatPrice(product.price)}</p>
                </CardContent>
            </Link>
            <CardFooter className="p-4 pt-0">
                <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full rounded-full bg-black hover:bg-gray-800"
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Adicionar
                </Button>
            </CardFooter>
        </Card>
    );
}
