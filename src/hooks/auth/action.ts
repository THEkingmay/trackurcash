'use server'

import { cookies } from "next/headers"
import { verifyToken } from "@/src/libs/token.lib";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
export async function getCurrentUserProfile() {
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
        return user[0] || null
    }
    catch (error) {
        console.error("Error fetching user profile:", error)
        return null
    }

}