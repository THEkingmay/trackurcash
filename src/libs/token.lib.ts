import jwt from "jsonwebtoken";
import { cookies } from "next/dist/server/request/cookies";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<{ userId: string; } | null> {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
        console.error("Invalid token:", error);
        // ลบคุกกี้ถ้า token ไม่ถูกต้อง
        const cookieStore = await cookies()
        cookieStore.delete("auth_token")
        return null;
    }
}

