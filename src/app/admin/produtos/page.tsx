import { prisma } from "@/lib/prisma";
import { prisma as db } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
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
import Image from "next/image";

export default async function AdminProductsPage() {
    const productsRaw = await db.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    const products = productsRaw.map((p: any) => ({
        ...p,
        price: Number(p.price)
    }));

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-black">Produtos</h1>
                    <p className="text-gray-500">Gerencie seu catálogo de produtos</p>
                </div>
                <Button asChild className="rounded-full bg-black hover:bg-gray-800">
                    <Link href="/admin/produtos/novo">
                        <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
                    </Link>
                </Button>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[80px]">Imagem</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Preço</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product: any) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100 border">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold">{product.name}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell>{formatPrice(product.price)}</TableCell>
                                <TableCell>{product.stock} un.</TableCell>
                                <TableCell>
                                    <Badge variant={product.active ? "default" : "secondary"} className={product.active ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : ""}>
                                        {product.active ? "Ativo" : "Inativo"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/produtos/${product.id}`}>Editar</Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
