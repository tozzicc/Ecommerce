import { prisma } from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { OrderStatusSelector } from "@/components/admin/OrderStatusSelector";
import { Button } from "@/components/ui/button";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { name: true, email: true } },
            items: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-black">Pedidos</h1>
                <p className="text-gray-500">Gerencie as vendas e o status de entrega</p>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Pedido</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order: any) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs max-w-[100px] truncate">
                                    #{order.id.slice(-8).toUpperCase()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold">{order.user.name}</span>
                                        <span className="text-xs text-gray-500">{order.user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="font-bold">{formatPrice(order.total)}</TableCell>
                                <TableCell>
                                    <OrderStatusSelector orderId={order.id} initialStatus={order.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Detalhes</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
