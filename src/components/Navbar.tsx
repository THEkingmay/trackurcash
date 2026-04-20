"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../features/login/action";
import { Menu, X, LogOut } from "lucide-react";

const PATHS = [
    { name: "หน้าแรก", path: "/dashboard" },
    { name: "สรุปผล", path: "/dashboard/summary" },
    { name: "ข้อมูลส่วนตัว", path: "/dashboard/profile" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">

                {/* Desktop Navigation (ซ่อนในมือถือ แสดงตอนจอขนาด md ขึ้นไป) */}
                <nav className="hidden md:flex items-center gap-1">
                    {PATHS.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                aria-current={isActive ? "page" : undefined}
                                className={`px-4 py-2 rounded-md text-sm transition-all duration-200 ${isActive
                                    ? "bg-[var(--foreground)]/10 text-[var(--foreground)] font-semibold"
                                    : "text-[var(--muted)] hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Logout Button */}
                <div className="hidden md:flex items-center">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors duration-200"
                    >
                        <LogOut size={16} />
                        ออกจากระบบ
                    </button>
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                    className="md:hidden p-2 text-[var(--foreground)] hover:bg-[var(--foreground)]/10 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 shadow-lg animate-in slide-in-from-top-2">
                    <nav className="flex flex-col gap-2">
                        {PATHS.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)} // ปิดเมนูเมื่อกดเปลี่ยนหน้า
                                    className={`px-4 py-3 rounded-md text-sm transition-colors duration-200 ${isActive
                                        ? "bg-[var(--foreground)]/10 text-[var(--foreground)] font-semibold"
                                        : "text-[var(--muted)] hover:bg-[var(--foreground)]/5 hover:text-[var(--foreground)]"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                        <hr className="my-2 border-[var(--border)]" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-md transition-colors duration-200 w-full text-left"
                        >
                            <LogOut size={16} />
                            ออกจากระบบ
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
}