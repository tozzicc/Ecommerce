"use client";

import { useCart } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
    const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else if (data.error === "Não autorizado") {
                toast.error("Por favor, faça login para continuar.");
                window.location.href = "/login";
            } else {
                toast.error(data.error || "Erro ao iniciar checkout");
            }
        } catch (error) {
            toast.error("Erro na conexão com o servidor");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center px-4 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter uppercase">Seu carrinho está vazio</h1>
                <p className="mt-4 text-gray-500 max-w-sm">Parece que você ainda não adicionou nenhum produto ao seu carrinho.</p>
                <Button asChild className="mt-10 rounded-full px-10" size="lg">
                    <Link href="/produtos">Explorar Catálogo</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase text-black mb-12">SEU CARRINHO <span className="text-gray-400">({totalItems()})</span></h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-6 border-b pb-6 last:border-b-0">
                            <div className="relative h-40 w-full sm:w-40 overflow-hidden rounded-xl bg-gray-100 flex-shrink-0">
                                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                            </div>
                            <div className="flex flex-1 flex-col justify-between py-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold uppercase">{item.name}</h3>
                                        <p className="mt-1 text-sm text-gray-500">Entrega rápida disponível</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-2 border rounded-full p-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-lg font-bold">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-6">
                        <Button variant="link" className="text-gray-400 p-0 hover:text-black" onClick={clearCart}>Limpar Carrinho</Button>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="rounded-2xl bg-gray-50 p-8 sticky top-24">
                        <h2 className="text-xl font-bold uppercase mb-6">Resumo do Pedido</h2>
                        <div className="space-y-4 border-b pb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal ({totalItems()} itens)</span>
                                <span className="font-semibold">{formatPrice(subtotal())}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Frete</span>
                                <span className="text-green-600 font-semibold uppercase">Grátis</span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-between text-xl font-bold">
                            <span>TOTAL</span>
                            <span>{formatPrice(subtotal())}</span>
                        </div>
                        <Button
                            className="mt-8 w-full rounded-full bg-black py-6 text-lg font-bold hover:bg-gray-800"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? "Processando..." : (
                                <>Finalizar Compra <ArrowRight className="ml-2 h-5 w-5" /></>
                            )}
                        </Button>
                        <p className="mt-4 text-center text-xs text-gray-400">
                            Taxas e frete calculados no checkout.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
