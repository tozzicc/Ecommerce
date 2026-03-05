import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");

export async function middleware(request: any) {
    const token = request.cookies.get("session-token")?.value;

    const { pathname } = request.nextUrl;

    // Protect Admin routes
    if (pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            const { payload }: any = await jwtVerify(token, JWT_SECRET);
            if (payload.user?.role !== "ADMIN") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Protect Account routes
    if (pathname.startsWith("/minha-conta")) {
        if (!token) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Redirect to home if logged in and trying to access login/register
    if (pathname === "/login" || pathname === "/cadastro") {
        if (token) {
            try {
                await jwtVerify(token, JWT_SECRET);
                return NextResponse.redirect(new URL("/", request.url));
            } catch (error) {
                // Token invalid, allow login/register
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/minha-conta/:path*", "/login", "/cadastro"],
};
