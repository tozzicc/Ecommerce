import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
    const [productCount, orderCount, userCount, totalRevenue] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.aggregate({
            where: { status: "PAID" },
            _sum: { total: true },
        }),
    ]);

    const stats = [
        {
            label: "Receita Total",
            value: formatPrice(totalRevenue._sum.total || 0),
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            label: "Pedidos Realizados",
            value: orderCount.toString(),
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Produtos Ativos",
            value: productCount.toString(),
            icon: Package,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            label: "Clientes",
            value: userCount.toString(),
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-black">Dashboard</h1>
                    <p className="text-gray-500">Visão geral do seu e-commerce</p>
                </div>
                <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2 shadow-sm border">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-bold text-gray-700">Crescimento de 12%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-none shadow-sm overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                                        <h3 className="mt-2 text-3xl font-bold tracking-tighter">{stat.value}</h3>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-40 items-center justify-center border-2 border-dashed rounded-xl">
                            <p className="text-sm text-gray-400 italic">Gráfico de vendas em breve...</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-400">Produtos Mais Vendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-40 items-center justify-center border-2 border-dashed rounded-xl">
                            <p className="text-sm text-gray-400 italic">Ranking de produtos em breve...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
