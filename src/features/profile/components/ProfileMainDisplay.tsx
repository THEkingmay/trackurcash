'use client'

import UserDataCard from "@/src/features/profile/components/UserDataCard";
import ProfileCard from "./ProfileCard";
import { useAuth } from "@/src/hooks/auth/AuthProvider";
import { createProfile } from "../action";
import toast from "react-hot-toast";

export default function ProfileMainDisplay() {
    const { user, profiles, setProfiles } = useAuth()

    const handleCreateProfile = async () => {
        try {
            if (!user) return;
            // ห้ามชื่อเหมือนโปรไฟล์ที่มีอยู่แล้ว
            const existingProfileNames = profiles ? profiles.map(p => p.name) : [];
            let newProfileName = "โปรไฟล์ใหม่";
            let counter = 1;
            while (existingProfileNames.includes(newProfileName)) {
                newProfileName = `โปรไฟล์ใหม่ (${counter})`;
                counter++;
            }
            const newProfile = await toast.promise(
                createProfile(user.id, newProfileName, "#ba4949"),
                {
                    loading: "กำลังสร้างโปรไฟล์...",
                    success: "โปรไฟล์ถูกสร้างเรียบร้อยแล้ว",
                    error: "เกิดข้อผิดพลาดในการสร้างโปรไฟล์",
                }
            );
            setProfiles(prev => [...(prev || []), newProfile]);
        } catch (err) {
            console.error("Error creating profile:", err);
        }
    }
    return (
        <div className="flex flex-col gap-6">
            {user && <UserDataCard user={user} />}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles && profiles.map(profile => (
                    <ProfileCard key={profile.id} profile={profile} />
                ))}
            </div>
            <div>
                {/* Future: Add "Create New Profile" button here */}
                <button onClick={handleCreateProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Create New Profile
                </button>
            </div>
        </div>
    )
}