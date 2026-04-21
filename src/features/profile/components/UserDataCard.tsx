'use client'
import { User } from "@/src/db/types";
export default function UserDataCard({ user }: { user: User }) {
    return (
        <div className="bg-[var(--card)] text-[var(--card-foreground)] shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
        </div>
    )
}