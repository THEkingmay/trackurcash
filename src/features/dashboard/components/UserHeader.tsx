import { User, Profile } from "@/src/db/types";
import { User2, Check } from "lucide-react";
import { useAuth } from "@/src/hooks/auth/AuthProvider";

interface UserHeaderProps {
    user: User | null;
    profiles: Profile[] | null;
    loading: boolean;
}

export default function UserHeader({ user, profiles, loading }: UserHeaderProps) {
    const { currentProfile, setCurrentProfile } = useAuth();

    // เอา default profile มาไว้หน้าสุด เพื่อให้แสดงผลได้ทันที 
    const sortedProfiles = profiles ? [...profiles].sort((a, b) => {
        if (a.is_default && !b.is_default) return -1;
        if (!a.is_default && b.is_default) return 1;
        return 0;
    }) : null;

    if (loading) {
        return (
            <div className="flex items-center space-x-4 p-4 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-[var(--surface-secondary)]" />
                <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-[var(--surface-secondary)]"></div>
                    <div className="h-3 w-24 rounded bg-[var(--surface-secondary)]"></div>
                </div>
            </div>
        );
    }

    if (!profiles && !user) {
        return (
            <div className="flex items-center space-x-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-[var(--surface-secondary)] text-[var(--muted)]">
                    <User2 size={24} />
                </div>
                <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">สวัสดี, ผู้ใช้งาน</p>
                    <p className="text-xs text-[var(--muted)]">ไม่พบข้อมูลระบบ</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">

            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    {user?.image ? (
                        <img
                            className="h-12 w-12 rounded-full object-cover border border-[var(--border)]"
                            src={user.image}
                            alt={`${user.name || 'User'}'s avatar`}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[var(--surface-secondary)] text-[var(--muted)]">
                            <User2 size={24} />
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <h2 className="text-base font-semibold text-[var(--foreground)]">
                        สวัสดี, {user?.name || "ผู้ใช้งาน"}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">{user?.email}</p>
                </div>
            </div>

            {sortedProfiles && sortedProfiles.length > 0 && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                            โปรไฟล์ของคุณ ({sortedProfiles.length})
                        </span>
                    </div>

                    <div className="flex overflow-x-auto gap-3 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {sortedProfiles.map(profile => {
                            const isActive = currentProfile?.id === profile.id;

                            return (
                                <button
                                    key={profile.id}
                                    onClick={() => setCurrentProfile(profile)}
                                    className={`
                                            flex-none w-45 group flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ease-in-out text-left
                                            ${isActive
                                            ? 'border-[var(--accent)] bg-[var(--surface-secondary)]'
                                            : 'border-[var(--border)] bg-transparent hover:border-[var(--muted)] hover:bg-[var(--surface-secondary)]'
                                        }
                                        `}
                                    aria-pressed={isActive}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div
                                            className="flex-none w-4 h-4 rounded-full shadow-sm ring-1 ring-inset ring-black/10"
                                            style={{ backgroundColor: profile.color_code || '#000000' }}
                                        />
                                        <span className={`text-sm truncate ${isActive ? 'font-medium text-[var(--foreground)]' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'}`}>
                                            {profile.name}

                                        </span>

                                    </div>

                                    {isActive && (
                                        <Check size={16} className="flex-none text-[var(--accent)]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}