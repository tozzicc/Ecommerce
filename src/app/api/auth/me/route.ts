import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user: session });
    } catch (error) {
        console.error("GET /api/auth/me error:", error);
        return NextResponse.json(
            { error: "Erro ao buscar sessão" },
            { status: 500 }
        );
    }
}
