"use client";

import { useCart } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
    product: any;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();

    const handleAdd = () => {
        addItem(product);
        toast.success(`${product.name} adicionado ao carrinho!`);
    };

    return (
        <Button
            size="lg"
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="w-full rounded-full bg-black text-white hover:bg-gray-800 md:w-auto px-12"
        >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Adicionar ao Carrinho
        </Button>
    );
}
