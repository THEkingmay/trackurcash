'use client'
import { Profile } from "@/src/db/types";
import { useEffect, useState } from "react";
import Button from "@/src/components/Button";

interface SelectProfileModalProps {
    profile: Profile | null;
    isOpen: boolean;
    onClose: () => void;
    handleUpdateProfile: (id: string, name: string, color_code: string) => Promise<void>;
    handleSetDefaultProfile: (newProfileId: string) => Promise<void>;
    handleDeleteProfile: (profileId: string) => Promise<void>;
}

export default function SelectProfileModal({
    profile,
    isOpen,
    onClose,
    handleUpdateProfile,
    handleSetDefaultProfile,
    handleDeleteProfile
}: SelectProfileModalProps) {
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("");

    useEffect(() => {
        if (profile && isOpen) {
            setEditName(profile.name);
            const colorHasHash = profile.color_code.startsWith('#');
            setEditColor(colorHasHash ? profile.color_code : `#${profile.color_code}`);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [profile, isOpen]);

    if (!profile || !isOpen) return null;

    const isNameEmpty = editName.trim() === "";
    const isDataChanged = editName !== profile.name || editColor !== profile.color_code;

    const onSave = async () => {
        if (isNameEmpty) return;
        await handleUpdateProfile(profile.id, editName, editColor);
        onClose();
    };

    const onSetDefault = async () => {
        await handleSetDefaultProfile(profile.id);
        onClose();
    };

    const onDelete = async () => {
        if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบโปรไฟล์ "${profile.name}"?\nข้อมูลที่เกี่ยวข้องอาจได้รับผลกระทบ`)) {
            await handleDeleteProfile(profile.id);
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
        >
            <div
                className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="h-8 w-8 rounded-lg shrink-0"
                        style={{ backgroundColor: editColor }}
                    />
                    <h2 className="text-base font-semibold flex-1 truncate">{profile.name}</h2>
                    <button
                        onClick={onClose}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors text-sm"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-4 pb-5 border-b border-[var(--border)]">
                    <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5 uppercase tracking-wider">ชื่อโปรไฟล์</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5 uppercase tracking-wider">สี</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={editColor}
                                onChange={(e) => setEditColor(e.target.value)}
                                className="h-10 w-14 shrink-0 cursor-pointer rounded-lg bg-transparent border border-[var(--border)]"
                            />
                            <span className="text-xs font-mono text-[var(--muted)] bg-[var(--surface-secondary)] border border-[var(--border)] px-3 py-1.5 rounded-lg uppercase">
                                {editColor}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={onSetDefault}
                            disabled={profile.is_default}
                            className="flex-1 text-sm py-2 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            {profile.is_default ? "✦ ค่าเริ่มต้น" : "ตั้งค่าเริ่มต้น"}
                        </button>
                        <Button
                            onClick={onSave}
                            disabled={isNameEmpty || !isDataChanged}
                            className="flex-1 py-2"
                        >
                            บันทึก
                        </Button>
                    </div>

                    {!profile.is_default && (
                        <button
                            onClick={onDelete}
                            className="w-full py-2 text-sm text-red-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                        >
                            ลบโปรไฟล์
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}