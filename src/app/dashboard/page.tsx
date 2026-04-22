'use client'
import { useAuth } from "@/src/hooks/auth/AuthProvider";

export default function DashboardPage() {
    const { currentProfile, loading, profiles } = useAuth()
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--background)] text-[var(--foreground)]">
                <h1 className="text-4xl font-bold tracking-tight">กำลังโหลด...</h1>
            </div>
        )
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--background)] text-[var(--foreground)]">
            <h1 className="text-4xl font-bold tracking-tight">หน้าหลักยินดีต้อนรับ</h1>
            <p className="mt-4 text-lg">
                ยินดีต้อนรับสู่แอปจัดการเงินของคุณ! {currentProfile ? `โปรไฟล์ที่ใช้งานอยู่: ${currentProfile.name}` : "ไม่มีโปรไฟล์ที่เลือก"}
            </p>
            <div>
                <h2 className="text-2xl font-semibold mt-8">โปรไฟล์ทั้งหมด:</h2>
                {profiles && profiles.length > 0 ? (
                    <ul className="mt-4 space-y-2">
                        {profiles.map(profile => (
                            <li key={profile.id} className="p-4 bg-[var(--card)] rounded shadow">
                                <h3 className="text-xl font-bold">{profile.name}</h3>
                                <p className="text-muted-foreground">สี: {profile.color_code}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-muted-foreground">ยังไม่มีโปรไฟล์ที่สร้างขึ้น</p>
                )}
            </div>
            <div className="mt-10">
                {/* Future: Add dashboard content here */}
            </div>
            <div className="mt-10">
                {/* Future: Add dashboard content here */}
            </div>
            <div className="mt-10">
                {/* Future: Add dashboard content here */}
            </div>
            <div className="mt-10">
            </div>
        </div>
    )
}