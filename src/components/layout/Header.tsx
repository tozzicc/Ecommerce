"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart-store";
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const { totalItems } = useCart();
    const [session, setSession] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/auth/me")
            .then((res) => res.json())
            .then((data) => setSession(data.user));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setSession(null);
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold tracking-tighter">
                    LOJA<span className="text-gray-400">.</span>
                </Link>

                <nav className="hidden space-x-8 md:flex">
                    <Link href="/produtos" className="text-sm font-medium hover:underline">
                        Produtos
                    </Link>
                    <Link href="/produtos?category=camisetas" className="text-sm font-medium hover:underline">
                        Camisetas
                    </Link>
                    <Link href="/produtos?category=calcados" className="text-sm font-medium hover:underline">
                        Calçados
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <div className="relative cursor-pointer" onClick={() => router.push("/carrinho")}>
                        <ShoppingCart className="h-6 w-6" />
                        {totalItems() > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                                {totalItems()}
                            </span>
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User className="h-6 w-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {session ? (
                                <>
                                    <DropdownMenuItem className="font-semibold">{session.name}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/minha-conta")}>Minha Conta</DropdownMenuItem>
                                    {session.role === "ADMIN" && (
                                        <DropdownMenuItem onClick={() => router.push("/admin")}>Painel Admin</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" /> Sair
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => router.push("/login")}>Login</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/cadastro")}>Cadastro</DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
