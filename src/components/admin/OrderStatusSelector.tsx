"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function OrderStatusSelector({ orderId, initialStatus }: { orderId: string, initialStatus: string }) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setStatus(newStatus);
                toast.success("Status atualizado!");
                router.refresh();
            } else {
                toast.error("Erro ao atualizar status");
            }
        } catch (error) {
            toast.error("Erro na conexão");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case "PAID": return "text-green-600 bg-green-50 border-green-100";
            case "SHIPPED": return "text-blue-600 bg-blue-50 border-blue-100";
            case "DELIVERED": return "text-purple-600 bg-purple-50 border-purple-100";
            case "CANCELED": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-gray-600 bg-gray-50 border-gray-100";
        }
    };

    return (
        <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
            <SelectTrigger className={`h-8 w-[140px] rounded-full text-xs font-bold border ${getStatusColor(status)}`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="PAID">Pago</SelectItem>
                <SelectItem value="SHIPPED">Enviado</SelectItem>
                <SelectItem value="DELIVERED">Entregue</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
            </SelectContent>
        </Select>
    );
}
