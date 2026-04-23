'use server'

import { db } from "@/src/db";
import { profiles } from "@/src/db/schema";
import { Profile, UpdateProfile } from "@/src/db/types";
import { profilesInsertSchema, profilesUpdateSchema } from "@/src/db/schema";
import { eq } from "drizzle-orm";

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

export async function updateProfile(newData: UpdateProfile): Promise<Profile> {
    const pasredUpdateProfile = profilesUpdateSchema.safeParse(newData)
    if (!pasredUpdateProfile.success) {
        console.error("[Validation error] : ", pasredUpdateProfile.error);
        throw new Error("Invalid profile data")
    }

    const updatedProfile = await db.update(profiles).set({
        name: pasredUpdateProfile.data.name,
        color_code: pasredUpdateProfile.data.color_code,
    }).where(eq(profiles.id, pasredUpdateProfile.data.id)).returning()

    if (!updatedProfile || updatedProfile.length === 0) {
        throw new Error("Failed to update profile")
    }
    return updatedProfile[0]
}

export async function deleteProfile(profileId: string): Promise<void> {
    await db.delete(profiles).where(eq(profiles.id, profileId))
}

export async function setDefaultProfile(oldProfileId: string, newProfileId: string): Promise<void> {
    await db.transaction(async (tx) => {
        await tx.update(profiles).set({ is_default: false }).where(eq(profiles.id, oldProfileId));
        await tx.update(profiles).set({ is_default: true }).where(eq(profiles.id, newProfileId));
    });
}
