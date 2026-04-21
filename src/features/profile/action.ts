'use server'

import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { Profile } from "@/src/db/types";
import { profilesInsertSchema } from "@/src/db/schema";


export async function createProfile(userId: string, name: string, color_code: string): Promise<Profile> {

    const pasredInsertProfile = profilesInsertSchema.safeParse({
        userId,
        name,
        color_code,
    })
    if (!pasredInsertProfile.success) {
        throw new Error("Invalid profile data")
    }

    const newProfile = await db.insert(profiles).values({
        userId: pasredInsertProfile.data.userId,
        name: pasredInsertProfile.data.name,
        color_code: pasredInsertProfile.data.color_code,
    }).returning()
    if (!newProfile || newProfile.length === 0) {
        throw new Error("Failed to create profile")
    }
    return newProfile[0]
}


