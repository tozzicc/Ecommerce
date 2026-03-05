import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold tracking-tighter">LOJA.</h3>
                        <p className="text-sm text-gray-500">
                            Sua loja de moda minimalista com entrega para todo o Brasil.
                        </p>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/produtos?category=camisetas" className="hover:underline">Camisetas</Link></li>
                            <li><Link href="/produtos?category=calcados" className="hover:underline">Calçados</Link></li>
                            <li><Link href="/produtos?category=acessorios" className="hover:underline">Acessórios</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Institucional</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:underline">Sobre Nós</Link></li>
                            <li><Link href="#" className="hover:underline">Políticas de Privacidade</Link></li>
                            <li><Link href="#" className="hover:underline">Termos de Uso</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Contato</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Email: contato@loja.com</li>
                            <li>WhatsApp: (11) 99999-9999</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t pt-8 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} LOJA. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    );
}
