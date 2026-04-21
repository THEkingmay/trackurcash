'use server'
import { db } from "@/src/db"
import { eq } from "drizzle-orm"
import { users } from "@/src/db/schema"
import { setData, getData, deleteData } from "@/src/libs/redis.lib"
import { sendEmail } from "@/src/libs/mail.lib"
import { generateToken } from "@/src/libs/token.lib"
import { cookies } from "next/headers"

// รับอีเมลเข้ามา จากนั้นสุ่มสร้างไอดีสำหรับการล็อกอิน พร้อมสร้างรหัส 6 หลักสำหรับการยืนยันตัวตน
// บันทึกข้อมูบลโดยใช้ไอดีการล็อกอินเป็นคีย์คู่กับ อีเมลและรหัสยืนยันตัวตนลงใน redis
// มีเวลาให้แค่ 5 นาทีในการยืนยันตัวตน หลังจากนั้นข้อมูลจะถูกลบออกจาก redis
export async function submitEmailToLogin(email: string) {
    try {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("รูปแบบอีเมลไม่ถูกต้อง")
        }
        const normalizedEmail = email.trim().toLowerCase()

        const loginId = crypto.randomUUID()
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

        await setData(`login:${loginId}`, { email: normalizedEmail, verificationCode }, 60 * 5)
        // ส่งเมลแจ้งแตือน
        await sendEmail({
            to: normalizedEmail,
            subject: "รหัสยืนยันตัวตนสำหรับการเข้าสู่ระบบ Track Your Cash",
            text: `รหัสยืนยันตัวตนของคุณคือ: ${verificationCode}\n\nโปรดใช้รหัสนี้เพื่อเข้าสู่ระบบภายใน 5 นาที 
            ลิงก์สำหรับเข้าสู่ระบบ: ${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify?loginId=${loginId}`,
        })

        // ย้ายหน้าไป /auth/verify?loginId=xxx
        return loginId

    } catch (err) {
        console.error("[submitEmailToLogin]", err)
        throw new Error((err as Error).message || "เกิดข้อผิดพลาดในการส่งอีเมลสำหรับล็อกอิน")
    }
}

export async function verifyLogin({ loginId, code }: { loginId: string, code: string }) {
    try {
        // กันการ brute-force attack โดยจำกัดจำนวนครั้งในการลองรหัสยืนยันตัวตน ถ้าลองผิดเกิน 5 ครั้งให้ลบข้อมูลใน redis ทิ้งและต้องเริ่มล็อกอินใหม่
        const attemptsKey = `login:${loginId}:attempts`
        const attempts = await getData<number>(attemptsKey) ?? 0

        if (attempts >= 5) {
            await deleteData(`login:${loginId}`)
            throw new Error("ลองผิดเกิน 5 ครั้ง กรุณาขอรหัสใหม่")
        }
        const data = await getData<{ email: string, verificationCode: string }>(`login:${loginId}`)
        if (!data) {
            throw new Error("รหัสยืนยันตัวตนไม่ถูกต้องหรือหมดอายุแล้ว")
        }

        if (data.verificationCode !== code) {
            await setData(attemptsKey, attempts + 1, 60 * 5)
            throw new Error("รหัสยืนยันตัวตนไม่ถูกต้อง")
        }

        // ดึง uuid จากอีเมลนี้ในฐานข้อมูล ถ้าไม่มีให้สร้างใหม่
        let user = await db.select().from(users).where(eq(users.email, data.email))
        if (user.length === 0) {
            user = await db.insert(users).values({ email: data.email }).returning()
        }
        if (user.length === 0) {
            throw new Error("เกิดข้อผิดพลาดในการสร้างบัญชีผู้ใช้")
        }
        const userId = user[0].id
        // สร้าง JWT token พร้อมกับ uuid ของผู้ใช้แล้วบันทึกลงใน cookie แบบ secure httpOnly
        const token = generateToken(userId)
        const cookieStore = await cookies()
        cookieStore.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 5, // 5 วัน
        })

        // ลบข้อมูลจาก redis หลังจากยืนยันตัวตนสำเร็จ
        await deleteData(`login:${loginId}`)
    } catch (err) {
        if (err instanceof Error && (
            err.message === "รหัสยืนยันตัวตนไม่ถูกต้องหรือหมดอายุแล้ว" ||
            err.message === "รหัสยืนยันตัวตนไม่ถูกต้อง" ||
            err.message === "ลองผิดเกิน 5 ครั้ง กรุณาขอรหัสใหม่"
        )) {
            throw err
        }
        console.error("[verifyLogin]", err)
        throw new Error("เกิดข้อผิดพลาดในการตรวจสอบรหัสยืนยันตัวตน")
    }
}

export async function logout() {
    try {
        const cookieStore = await cookies()
        cookieStore.delete("auth_token")
    } catch (err) {
        console.error("[logout]", err)
        throw new Error("เกิดข้อผิดพลาดในการออกจากระบบ")
    }
}