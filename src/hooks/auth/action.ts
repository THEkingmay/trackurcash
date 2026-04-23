'use server'

import { cookies } from "next/headers"
import { verifyToken } from "@/src/libs/token.lib";
import { db } from "@/src/db";
import { users, profiles } from "@/src/db/schema";
import { asc, eq } from "drizzle-orm";
export async function getCurrentUserData() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value
        if (!token) {
            return null
        }
        const payload = await verifyToken(token)
        if (!payload) {
            return null
        }
        const userId = payload.userId
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
        if (!user || user.length === 0) {
            // ลบ คุกกี้ที่ไม่ถูกต้อง
            cookieStore.delete("auth_token")
            return null
        }
        return user[0]
    }
    catch (error) {
        console.error("Error fetching user data:", error)
        return null
    }

}

export async function getUserProfiles() {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth_token")?.value
        if (!token) {
            return null
        }
        const payload = await verifyToken(token)
        if (!payload) {
            return null
        }
        const userId = payload.userId
        const userProfiles = await db.select().from(profiles).where(eq(profiles.userId, userId)).orderBy(asc(profiles.createdAt))
        return userProfiles
    } catch (error) {
        console.error("Error fetching user profiles:", error)
        return null
    }
}