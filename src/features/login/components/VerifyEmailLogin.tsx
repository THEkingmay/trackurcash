'use client'
import { useSearchParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import React from "react"
import { verifyLogin } from "../action"
import Button from "@/src/components/Button"
import Link from "next/link"
import Image from "next/image"
export default function VerifyEmailLogin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const loginId = searchParams.get("loginId")

    const [loading, setLoading] = React.useState(false)
    const [code, setCode] = React.useState("")

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault() // ป้องกัน Form รีเฟรชหน้าเว็บ

        if (!code) {
            toast.error("กรุณากรอกโค้ดยืนยันตัวตน")
            return
        }

        if (code.length < 6) {
            toast.error("กรุณากรอกโค้ดให้ครบ 6 หลัก")
            return
        }

        setLoading(true)

        try {
            await verifyLogin({ loginId: loginId as string, code })
            toast.success("ยืนยันตัวตนสำเร็จ")
            router.refresh() // ให้ middleware ทำงานใหม่เพื่อโหลดข้อมูลผู้ใช้ที่เพิ่งล็อกอินเข้ามา
        } catch (err) {
            toast.error((err as Error).message || "เกิดข้อผิดพลาดในการยืนยันตัวตน")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (!loginId) {
            toast.error("ไม่พบข้อมูลการล็อกอิน กรุณาลองใหม่อีกครั้ง")
            router.push("/auth")
        }
    }, [loginId, router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--background)] text-[var(--foreground)]">

            <div className="w-full max-w-md p-8 rounded-2xl shadow-sm border border-[var(--border)] bg-[var(--surface)]">
                <div className="flex justify-center mb-5">
                    <div className="border rounded-full p-6 bg-[var(--surface-secondary)] border-[var(--border)]">
                        <Image
                            src="/img01.jpg"
                            alt="Login"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">ยืนยันตัวตน</h1>
                    <p className="text-[var(--muted)] mt-2 text-sm">
                        เราได้ส่งโค้ด 6 หลักไปที่อีเมลของคุณแล้ว<br />โปรดกรอกโค้ดด้านล่าง
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            inputMode="numeric" // บังคับคีย์บอร์ดมือถือให้เป็นตัวเลข
                            maxLength={6} // บังคับพิมพ์ได้แค่ 6 ตัว
                            placeholder="000000"
                            value={code}
                            onChange={(e) => {
                                // อนุญาตให้พิมพ์เฉพาะตัวเลขเท่านั้น
                                const val = e.target.value.replace(/\D/g, '')
                                setCode(val)
                            }}
                            disabled={loading}
                            className="w-full px-4 py-4 border border-[var(--border)] rounded-xl bg-[var(--surface-secondary)] text-[var(--foreground)] placeholder-[var(--muted)] text-center tracking-[1em] font-mono text-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all disabled:opacity-50"
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        className="w-full"
                        loading={loading}
                    >
                        ยืนยันตัวตน
                    </Button>
                </form>


            </div>

            <div className="mt-8">
                <Link
                    href="/auth"
                    className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors focus:outline-none"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    กลับไปหน้าเข้าสู่ระบบ
                </Link>
            </div>

        </div>
    )
}