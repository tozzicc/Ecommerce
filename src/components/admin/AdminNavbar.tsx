"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Store, LogOut, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Produtos", href: "/admin/produtos", icon: Package },
        { label: "Categorias", href: "/admin/categorias", icon: Tags },
        { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
    ];

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-[#111111] text-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center space-x-8">
                    <Link href="/admin" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tighter">LOJA<span className="text-gray-500">.</span></span>
                        <Badge variant="secondary" className="bg-white/10 text-[10px] text-white hover:bg-white/20 uppercase">Admin</Badge>
                    </Link>

                    <div className="hidden space-x-1 md:flex">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${isActive ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button asChild variant="ghost" size="sm" className="hidden text-gray-400 hover:bg-white/10 hover:text-white md:flex">
                        <Link href="/">
                            <Store className="mr-2 h-4 w-4" /> Ver Loja
                        </Link>
                    </Button>
                    <div className="h-4 w-[1px] bg-white/10" />
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:bg-white/10 hover:text-white">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </nav>
    );
}
