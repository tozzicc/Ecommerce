"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

interface ProductFormProps {
    product?: any;
    categories: any[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        stock: product?.stock || "",
        categoryId: product?.categoryId || "",
        images: product?.images?.join(", ") || "",
        active: product?.active ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const slug = slugify(formData.name);
        const data = {
            ...formData,
            slug,
            price: parseFloat(formData.price as string),
            stock: parseInt(formData.stock as string),
            images: formData.images.split(",").map((img: string) => img.trim()).filter(Boolean),
        };

        try {
            const url = product ? `/api/products/${product.id}` : "/api/products";
            const method = product ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success(product ? "Produto atualizado!" : "Produto criado!");
                router.push("/admin/produtos");
                router.refresh();
            } else {
                const err = await res.json();
                toast.error(err.error || "Erro ao salvar produto");
            }
        } catch (error) {
            toast.error("Erro na conexão com o servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-xl resize-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                        id="stock"
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="rounded-xl"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                    value={formData.categoryId}
                    onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                >
                    <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="images">Imagens (URLs separadas por vírgula)</Label>
                <Input
                    id="images"
                    placeholder="https://exemplo.com/foto1.jpg, https://exemplo.com/foto2.jpg"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="rounded-xl"
                />
            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Produto Ativo</Label>
                    <p className="text-xs text-gray-500">O produto ficará visível na loja pública.</p>
                </div>
                <Switch
                    checked={formData.active}
                    onCheckedChange={(val) => setFormData({ ...formData, active: val })}
                />
            </div>

            <div className="flex space-x-4 pt-4">
                <Button
                    type="submit"
                    className="flex-1 rounded-full bg-black py-6 text-lg font-bold hover:bg-gray-800"
                    disabled={loading}
                >
                    {loading ? "Salvando..." : (product ? "Salvar Alterações" : "Criar Produto")}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/admin/produtos")}
                    className="rounded-full py-6 text-gray-500"
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
}
