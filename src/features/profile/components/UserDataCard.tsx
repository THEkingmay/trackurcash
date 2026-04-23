'use client'
import { User } from "@/src/db/types";

export default function UserDataCard({ user }: { user: User }) {
    const joinedDate = new Date(user.createdAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-5 max-w-sm">
            <div className="h-14 w-14 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] overflow-hidden shrink-0 flex items-center justify-center">
                {user.image ? (
                    <img src={user.image} alt={user.name || "ผู้ใช้"} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-[var(--muted)] text-xl font-semibold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
            <div className="min-w-0">
                <p className="font-semibold text-[var(--foreground)] truncate">{user.name || "ชื่อผู้ใช้"}</p>
                <p className="text-sm text-[var(--muted)] truncate mt-0.5">{user.email}</p>
                <p className="text-xs text-[var(--muted)] mt-2 opacity-60">เข้าร่วม {joinedDate}</p>
            </div>
        </div>
    )
}