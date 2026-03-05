import { Metadata } from "next";
import { Inter } from "next/font/google";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Painel Admin | LOJA.",
    description: "Gestão completa do e-commerce",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.className} min-h-screen bg-[#F9F9F9]`}>
            <AdminNavbar />
            <main className="p-8 lg:p-12">
                <div className="mx-auto max-w-7xl">{children}</div>
            </main>
        </div>
    );
}
