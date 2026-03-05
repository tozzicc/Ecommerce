import { prisma } from "@/lib/prisma";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Tags } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true },
            },
        },
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tighter uppercase text-black">Categorias</h1>
                    <p className="text-gray-500">Gerencie as categorias dos seus produtos</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-full bg-black hover:bg-gray-800">
                            <Plus className="mr-2 h-4 w-4" /> Nova Categoria
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-extrabold tracking-tighter uppercase">Nova Categoria</DialogTitle>
                        </DialogHeader>
                        <CategoryForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[50px]">
                                <Tags className="h-4 w-4 text-gray-400" />
                            </TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Produtos</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat: any) => (
                            <TableRow key={cat.id}>
                                <TableCell>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                                        <Tags className="h-4 w-4 text-gray-500" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold">{cat.name}</TableCell>
                                <TableCell className="text-xs font-mono text-gray-400">{cat.slug}</TableCell>
                                <TableCell>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                                        {cat._count.products} itens
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm">Editar</Button>
                                            </DialogTrigger>
                                            <DialogContent className="rounded-2xl sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-extrabold tracking-tighter uppercase">Editar Categoria</DialogTitle>
                                                </DialogHeader>
                                                <CategoryForm initialData={cat} />
                                            </DialogContent>
                                        </Dialog>
                                        <DeleteCategoryButton
                                            categoryId={cat.id}
                                            categoryName={cat.name}
                                            productsCount={cat._count.products}
                                        />
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
