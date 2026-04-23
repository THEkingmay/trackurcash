'use client'
import { Profile } from "@/src/db/types";

export default function ProfileCard({ profile }: { profile: Profile }) {
    return (
        <div className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:border-[var(--accent)]/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
            <div
                className="h-10 w-10 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ backgroundColor: profile.color_code }}
            />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--foreground)] truncate leading-tight">
                    {profile.name}
                </p>
                {profile.is_default && (
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)] opacity-80">
                        Default
                    </span>
                )}
            </div>
            <div className="shrink-0 text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <div
                className="absolute inset-y-0 left-0 w-0.5 transition-all duration-200 group-hover:opacity-100 opacity-0 rounded-full"
                style={{ backgroundColor: profile.color_code }}
            />
        </div>
    )
}