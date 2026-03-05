"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryFormProps {
    initialData?: { id: string; name: string };
    onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
    const [name, setName] = useState(initialData?.name || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const url = initialData
                ? `/api/categories/${initialData.id}`
                : "/api/categories";
            const method = initialData ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() }),
            });

            if (res.ok) {
                toast.success(initialData ? "Categoria atualizada!" : "Categoria criada!");
                if (!initialData) setName("");
                router.refresh();
                if (onSuccess) onSuccess();
            } else {
                const data = await res.json();
                toast.error(data.error || "Erro ao salvar categoria");
            }
        } catch (error) {
            toast.error("Erro na conexão");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Nome da Categoria</label>
                <Input
                    placeholder="Ex: Camisetas, Tênis..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="rounded-xl border-gray-200 focus:ring-black"
                />
            </div>
            <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full rounded-full bg-black hover:bg-gray-800"
            >
                {loading ? "Salvando..." : initialData ? "Atualizar" : "Criar Categoria"}
            </Button>
        </form>
    );
}
