'use client'
import Button from "@/src/components/Button"
import toast from "react-hot-toast"
import { submitEmailToLogin } from "../action"
import React from "react"
import { useRouter } from "next/navigation" // ใช้ useRouter ของ Next.js

export default function LoginMain() {
    const [email, setEmail] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // ป้องกันไม่ให้หน้าเว็บรีเฟรชตอนกด Submit (สำคัญมากเวลาใช้ <form>)

        if (!email) {
            toast.error("กรุณากรอกอีเมลของคุณ")
            return
        }

        try {
            setLoading(true)
            const loginId = await submitEmailToLogin(email)
            router.push(`/auth/verify?loginId=${loginId}`) // ใช้ Client-side routing
        } catch (err) {
            toast.error("เกิดข้อผิดพลาดในการส่งอีเมลสำหรับล็อกอิน")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        // TODO: รอไปเชื่อมต่อกับ Auth Provider (เช่น NextAuth หรือ Supabase)
        toast("กำลังพัฒนาระบบล็อกอินด้วย Google...", { icon: '🛠️' })
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-sm border border-[var(--border)] bg-[var(--surface)]">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">เข้าสู่ระบบ</h1>
                    <p className="text-[var(--muted)] mt-2 text-sm">กรอกอีเมลของคุณเพื่อเข้าสู่ระบบ</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        placeholder="อีเมลของคุณ"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading} // ปิดช่องกรอกตอนกำลังโหลด
                        className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        className="w-full"
                        loading={loading}
                    >
                        ส่งรหัสยืนยันตัวตน
                    </Button>
                </form>

                <div className="mt-8 flex items-center justify-center space-x-4">
                    <div className="h-px bg-[var(--border)] flex-1"></div>
                    <span className="text-sm text-[var(--muted)]">หรือดำเนินการต่อด้วย</span>
                    <div className="h-px bg-[var(--border)] flex-1"></div>
                </div>

                <div className="mt-6">
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--border)] rounded-xl bg-[#ffffff] text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-medium shadow-sm"
                    >
                        {/* ไอคอน Google แบบ SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>

            </div>
        </div>
    )
}