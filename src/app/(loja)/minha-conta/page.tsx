"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyAccountPage() {
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await fetch("/api/auth/me");
                const userData = await userRes.json();
                setUser(userData.user);

                // Fetch orders - we'll need to create this API route
                const ordersRes = await fetch("/api/orders/me");
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    if (loading) return (
        <div className="container mx-auto px-4 py-20 text-center uppercase tracking-tighter font-bold">Carregando...</div>
    );

    return (
        <div className="container mx-auto px-4 py-20">
            <div className="mb-12 flex items-center justify-between">
                <h1 className="text-4xl font-extrabold tracking-tighter uppercase text-black">Minha Conta</h1>
                <Button variant="ghost" className="text-red-500 hover:text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sair
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Info Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-gray-50 rounded-2xl">
                        <CardHeader>
                            <CardTitle className="flex items-center text-sm font-bold uppercase tracking-widest text-gray-500">
                                <UserIcon className="mr-2 h-4 w-4" /> Perfil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <p className="font-bold text-xl">{user?.name}</p>
                            <p className="text-gray-500">{user?.email}</p>
                            <Badge variant="outline" className="mt-4 border-black text-black">
                                {user?.role === "ADMIN" ? "Administrador" : "Cliente"}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders List */}
                <div className="lg:col-span-2 space-y-8">
                    <h2 className="text-2xl font-bold tracking-tighter uppercase border-b pb-4">Meus Pedidos</h2>

                    {orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="border transition-colors hover:bg-gray-50">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Package className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                                                <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">{formatPrice(order.total)}</p>
                                            <Badge
                                                variant={order.status === "PAID" ? "default" : "secondary"}
                                                className={order.status === "PAID" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none px-3" : ""}
                                            >
                                                {order.status === "PAID" ? "Pago" : "Pendente"}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 text-center">
                            <p className="text-gray-400">Você ainda não realizou nenhum pedido.</p>
                            <Button asChild variant="link" className="mt-2 text-black font-bold uppercase tracking-tighter">
                                <Link href="/produtos">Começar a comprar →</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
