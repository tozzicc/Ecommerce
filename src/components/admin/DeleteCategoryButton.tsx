"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteCategoryButtonProps {
    categoryId: string;
    categoryName: string;
    productsCount: number;
}

export function DeleteCategoryButton({ categoryId, categoryName, productsCount }: DeleteCategoryButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (productsCount > 0) {
            toast.error("Não é possível excluir uma categoria que possui produtos!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/categories/${categoryId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Categoria excluída com sucesso!");
                router.refresh();
            } else {
                const data = await res.json();
                toast.error(data.error || "Erro ao excluir categoria");
            }
        } catch (error) {
            toast.error("Erro na conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-extrabold tracking-tighter uppercase">Excluir Categoria?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja excluir a categoria <strong>{categoryName}</strong>?
                        {productsCount > 0 && " Esta categoria possui produtos associados e não pode ser excluída."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading || productsCount > 0}
                        className="rounded-full bg-red-500 hover:bg-red-600"
                    >
                        {loading ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
