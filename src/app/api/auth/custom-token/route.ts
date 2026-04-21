import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { generateToken } from "@/src/libs/token.lib";
import { db } from "@/src/db";
import { eq } from "drizzle-orm";
import { users } from "@/src/db/schema";
import { NextResponse } from "next/server";
// เชค  session จาก nextauth ไ้ด้ email name image 
// ถ้าไม่มี session หรือ email ให้ส่ง error กลับไป
// ถ้ามี email ให้เชคในฐานข้อมูลว่ามี user นี้อยู่หรือยัง ถ้าไม่มีให้สร้างใหม่
// สร้าง token โดยใช้ userId แล้วส่ง token กลับไปยัง https cookies
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { email, name, image } = session.user
        let user = await db.select().from(users).where(eq(users.email, email))
        if (user.length === 0) {
            const [newUser] = await db.insert(users).values({ email, name, image }).returning()
            user = [newUser]
        }
        if (user.length === 0) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
        }
        const userId = user[0].id
        const token = generateToken(userId)
        const response = NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"))

        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 5, // 5 วัน
        })
        return response
    } catch (err) {
        console.error("[custom-token]", err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}