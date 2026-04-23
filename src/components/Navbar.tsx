"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../features/login/action";
import { LogOut, User, ChevronDown, Home, ChartAreaIcon } from "lucide-react"; // ลบ Menu, X ออกเพราะไม่ได้ใช้แล้ว
import { useAuth } from "@/src/hooks/auth/AuthProvider";
import Image from "next/image";

const PATHS = [
    { name: "หน้าแรก", path: "/dashboard", icon: Home },
    { name: "สรุปผล", path: "/dashboard/summary", icon: ChartAreaIcon },
    { name: "ข้อมูลส่วนตัว", path: "/dashboard/profile", icon: User },
];

function NavSkeleton() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                <div className="h-4 w-32 rounded-full bg-[var(--foreground)]/8 animate-pulse" />

                {/* ปรับให้ Skeleton แสดงเป็นวงกลม Avatar ในทุกขนาดหน้าจอ */}
                <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-[var(--foreground)]/8 animate-pulse" />
                    <div className="hidden lg:block h-3 w-16 rounded-full bg-[var(--foreground)]/8 animate-pulse" />
                </div>
            </div>
        </header>
    );
}

function AvatarImage({ name, image }: { name?: string | null; image?: string | null }) {
    const [imgError, setImgError] = useState(false);

    if (image && !imgError) {
        return (
            <img
                src={image}
                alt={name ?? "User"}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className="h-7 w-7 rounded-full object-cover"
            />
        );
    }

    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : null;

    if (initials) {
        return (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--foreground)]/10 text-[10px] font-semibold tracking-wide text-[var(--foreground)]">
                {initials}
            </span>
        );
    }

    return (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--foreground)]/10 text-[var(--muted)]">
            <User size={14} />
        </span>
    );
}

function AvatarDropdown({ user, onLogout }: {
    user: { name?: string | null; email: string; image?: string | null };
    onLogout: () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-[var(--foreground)]/5 transition-colors duration-150"
            >
                <span className="ring-1 ring-[var(--border)] rounded-full">
                    <AvatarImage name={user.name} image={user.image} />
                </span>
                <span className="text-xs text-[var(--muted)] max-w-[100px] truncate hidden lg:block">
                    {user.name ?? user.email}
                </span>
                <ChevronDown
                    size={12}
                    className={`text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg shadow-black/5 py-1 z-50">
                    <div className="px-3 py-2.5 border-b border-[var(--border)]">
                        {user.name && (
                            <p className="text-xs font-medium text-[var(--foreground)] truncate">{user.name}</p>
                        )}
                        <p className="text-[11px] text-[var(--muted)] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                        {PATHS.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2 text-xs transition-colors duration-150 ${isActive
                                        ? "bg-[var(--foreground)]/8 text-[var(--foreground)] font-medium"
                                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                                        }`}
                                >
                                    <item.icon size={12} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="border-t border-[var(--border)] py-1">
                        <button
                            onClick={() => { setOpen(false); onLogout(); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-500 hover:bg-red-500/8 transition-colors duration-150"
                        >
                            <LogOut size={13} />
                            ออกจากระบบ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const router = useRouter();
    const { loading, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/auth");
        router.refresh();
    };

    if (loading) return <NavSkeleton />;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">

                <Link
                    href="/dashboard"
                    className="text-sm font-semibold tracking-tight text-[var(--foreground)] transition-opacity hover:opacity-70"
                >
                    <div className="flex items-center gap-2">
                        <Image
                            src={'/img02.png'}
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                        <span className="hidden sm:block">Track Your Cash</span>
                    </div>
                </Link>

                {/* เอา hidden md:flex ออก เพื่อให้ AvatarDropdown แสดงผลในทุกขนาดหน้าจอ */}
                <div className="flex items-center">
                    {user && <AvatarDropdown user={user} onLogout={handleLogout} />}
                </div>

            </div>
        </header>
    );
}