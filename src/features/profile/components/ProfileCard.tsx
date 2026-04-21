'use client'
import { Profile } from "@/src/db/types"

export default function ProfileCard({ profile }: { profile: Profile }) {
    return (
        <div className="bg-[var(--card)] text-[var(--card-foreground)] shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">ประเภท: {profile.color_code}</p>
        </div>
    )
}