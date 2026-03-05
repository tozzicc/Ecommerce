import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase text-black">Obrigado pelo seu pedido!</h1>
            <p className="mt-4 max-w-md text-gray-500">
                Seu pagamento foi processado com sucesso. Você receberá um e-mail com os detalhes da sua compra em breve.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Button asChild className="rounded-full bg-black px-10 text-white hover:bg-gray-800" size="lg">
                    <Link href="/minha-conta">Ver Meus Pedidos</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-10 border-black text-black" size="lg">
                    <Link href="/">Voltar para a Loja</Link>
                </Button>
            </div>
        </div>
    );
}
