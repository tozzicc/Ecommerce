import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { compare, hash } from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
    process.env.AUTH_SECRET || "fallback-secret"
);

export interface SessionUser {
    id: string;
    email: string;
    name: string;
    role: "CUSTOMER" | "ADMIN";
}

export async function hashPassword(password: string) {
    return hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string) {
    return compare(password, hashed);
}

export async function createToken(user: SessionUser) {
    return new SignJWT({ user })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return (payload as unknown as { user: SessionUser }).user;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session-token")?.value;
    if (!token) return null;
    return verifyToken(token);
}

export async function requireAuth(): Promise<SessionUser> {
    const session = await getSession();
    if (!session) throw new Error("Não autorizado");
    return session;
}

export async function requireAdmin(): Promise<SessionUser> {
    const session = await requireAuth();
    if (session.role !== "ADMIN") throw new Error("Acesso negado");
    return session;
}
