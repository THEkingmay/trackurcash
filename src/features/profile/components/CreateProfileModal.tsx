'use client'

import { useState } from "react";
import Button from "@/src/components/Button";

interface CreateProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, color: string) => void;
}

export default function CreateProfileModal({ isOpen, onClose, onSubmit }: CreateProfileModalProps) {
    const [profileName, setProfileName] = useState("");
    const [colorCode, setColorCode] = useState("#ba4949");

    const isSubmitDisabled = profileName.trim() === "";

    const handleSubmit = () => {
        if (isSubmitDisabled) return;
        onSubmit(profileName, colorCode);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4"
        >
            <div
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-semibold text-[var(--foreground)]">สร้างโปรไฟล์ใหม่</h2>
                    <button
                        onClick={onClose}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] transition-colors text-sm"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5 uppercase tracking-wider" htmlFor="profile-name">
                            ชื่อโปรไฟล์
                        </label>
                        <input
                            type="text"
                            id="profile-name"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full bg-[var(--surface-secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)]/50 transition-all placeholder:text-[var(--muted)]/50"
                            placeholder="เช่น บัญชีเงินเก็บ, โปรเจกต์งาน"
                            maxLength={30}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1.5 uppercase tracking-wider" htmlFor="color-code">
                            สี
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                id="color-code"
                                value={colorCode}
                                onChange={(e) => setColorCode(e.target.value)}
                                className="h-10 w-14 shrink-0 cursor-pointer rounded-lg bg-transparent border border-[var(--border)] transition-colors"
                            />
                            <span className="text-xs font-mono text-[var(--muted)] bg-[var(--surface-secondary)] border border-[var(--border)] px-3 py-1.5 rounded-lg">
                                {colorCode}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
                    <button
                        onClick={onClose}
                        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] px-4 py-2 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
                        สร้างโปรไฟล์
                    </Button>
                </div>
            </div>
        </div>
    );
}