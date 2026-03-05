import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase text-black">Ops! Algo deu errado.</h1>
            <p className="mt-4 max-w-sm text-gray-500">
                Não foi possível processar o seu pagamento. Por favor, tente novamente ou entre em contato com o suporte.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Button asChild className="rounded-full bg-black px-10 text-white hover:bg-gray-800" size="lg">
                    <Link href="/carrinho">Voltar para o Carrinho</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full px-10 border-black text-black" size="lg">
                    <Link href="/">Sair</Link>
                </Button>
            </div>
        </div>
    );
}
