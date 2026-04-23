'use client'

import { useState } from "react";
import UserDataCard from "@/src/features/profile/components/UserDataCard";
import ProfileCard from "./ProfileCard";
import { useAuth } from "@/src/hooks/auth/AuthProvider";
import { createProfile } from "../action";
import toast from "react-hot-toast";
import Button from "@/src/components/Button";
import CreateProfileModal from "./CreateProfileModal";
import SelectProfileModal from "./SelectProfileModal";
import { NewProfile, Profile } from "@/src/db/types";
import { updateProfile, setDefaultProfile, deleteProfile } from "../action";
import { profilesUpdateSchema } from "@/src/db/schema";

function UserDataCardSkeleton() {
    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-5 max-w-sm animate-pulse">
            <div className="h-14 w-14 rounded-xl bg-[var(--surface-secondary)] shrink-0" />
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="h-4 w-32 bg-[var(--surface-secondary)] rounded-lg" />
                <div className="h-3 w-44 bg-[var(--surface-secondary)] rounded-lg" />
                <div className="h-3 w-24 bg-[var(--surface-secondary)] rounded-lg mt-1" />
            </div>
        </div>
    );
}

function ProfileCardSkeleton() {
    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4 animate-pulse">
            <div className="h-10 w-10 rounded-xl bg-[var(--surface-secondary)] shrink-0" />
            <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="h-4 w-28 bg-[var(--surface-secondary)] rounded-lg" />
                <div className="h-3 w-16 bg-[var(--surface-secondary)] rounded-lg" />
            </div>
            <div className="h-4 w-4 rounded bg-[var(--surface-secondary)] shrink-0" />
        </div>
    );
}

export default function ProfileContainer() {
    const { loading, user, profiles, setProfiles } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

    const handleProfileSubmit = async (name: string, color: string) => {
        try {
            if (!user) return;
            const existingProfileNames = profiles ? profiles.map(p => p.name) : [];
            let uniqueName = name;
            let counter = 1;
            while (existingProfileNames.includes(uniqueName)) {
                uniqueName = `${name} (${counter})`;
                counter++;
            }
            const newProfile = await toast.promise(
                createProfile(user.id, uniqueName, color),
                {
                    loading: "กำลังสร้างโปรไฟล์...",
                    success: `โปรไฟล์ "${uniqueName}" ถูกสร้างเรียบร้อยแล้ว`,
                    error: "เกิดข้อผิดพลาดในการสร้างโปรไฟล์",
                }
            );
            setProfiles(prev => [...(prev || []), newProfile]);
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error("Error creating profile:", err);
        }
    };

    const handleUpdateProfile = async (id: string, name: string, color_code: string) => {
        try {
            const newData: NewProfile = {
                ...selectedProfile!,
                name,
                color_code,
                updatedAt: new Date()
            }
            const parseNewData = profilesUpdateSchema.safeParse(newData);
            if (!parseNewData.success) {
                console.error("Validation error:", parseNewData.error);
                throw new Error("Invalid profile data");
            }
            const updatedProfile = await toast.promise(
                updateProfile(parseNewData.data),
                {
                    loading: "กำลังอัปเดตโปรไฟล์...",
                    success: `โปรไฟล์ "${name}" ถูกอัปเดตเรียบร้อยแล้ว`,
                    error: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์",
                }
            );
            setProfiles(prev => prev ? prev.map(p => p.id === id ? updatedProfile : p) : [updatedProfile]);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    }

    const handleSetDefaultProfile = async (newProfileId: string) => {
        try {
            const oldDefaultProfile = profiles ? profiles.find(p => p.is_default) : null;
            const oldProfileId = oldDefaultProfile ? oldDefaultProfile.id : "";
            await toast.promise(
                setDefaultProfile(oldProfileId, newProfileId),
                {
                    loading: "กำลังตั้งค่าโปรไฟล์เริ่มต้น...",
                    success: `ตั้งค่าโปรไฟล์เริ่มต้นเรียบร้อยแล้ว`,
                    error: "เกิดข้อผิดพลาดในการตั้งค่าโปรไฟล์เริ่มต้น",
                }
            );
            setProfiles(prev => prev ? prev.map(p => ({ ...p, is_default: p.id === newProfileId })) : null);
        } catch (err) {
            console.error("Error setting default profile:", err);
        }
    }

    const handleDeleteProfile = async (profileId: string) => {
        try {
            await toast.promise(
                deleteProfile(profileId),
                {
                    loading: "กำลังลบโปรไฟล์...",
                    success: `ลบโปรไฟล์เรียบร้อยแล้ว`,
                    error: "เกิดข้อผิดพลาดในการลบโปรไฟล์",
                }
            );
            setProfiles(prev => prev ? prev.filter(p => p.id !== profileId) : null);
        } catch (err) {
            console.error("Error deleting profile:", err);
        }
    }

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-14">

                <section>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-1">บัญชีผู้ใช้</p>
                    <h1 className="text-2xl font-bold tracking-tight mb-5">ประวัติผู้ใช้</h1>
                    {loading ? <UserDataCardSkeleton /> : user && <UserDataCard user={user} />}
                </section>

                <section>
                    <div className="flex items-end justify-between mb-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-1">จัดการ</p>
                            <h2 className="text-2xl font-bold tracking-tight">โปรไฟล์</h2>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setIsCreateModalOpen(true)}
                            disabled={loading}
                        >
                            + เพิ่มโปรไฟล์
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <ProfileCardSkeleton key={i} />
                            ))
                        ) : profiles && profiles.length > 0 ? (
                            profiles.map(profile => (
                                <div key={profile.id} onClick={() => setSelectedProfile(profile)}>
                                    <ProfileCard profile={profile} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-14 px-6 bg-[var(--surface)] rounded-2xl border border-dashed border-[var(--border)]">
                                <p className="text-[var(--muted)] text-sm">ยังไม่มีโปรไฟล์ — คลิก "เพิ่มโปรไฟล์" เพื่อเริ่มต้น</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <CreateProfileModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleProfileSubmit}
            />
            <SelectProfileModal
                profile={selectedProfile}
                isOpen={!!selectedProfile}
                onClose={() => setSelectedProfile(null)}
                handleUpdateProfile={handleUpdateProfile}
                handleSetDefaultProfile={handleSetDefaultProfile}
                handleDeleteProfile={handleDeleteProfile}
            />
        </main>
    )
}