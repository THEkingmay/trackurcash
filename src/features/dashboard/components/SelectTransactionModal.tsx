'use client';
import { Transaction } from "@/src/db/types";
import toast from "react-hot-toast";
import { updateTransaction, deleteTransaction } from "../action";
import { useState, useEffect } from "react";
import { transactionsInsertSchema } from "../../../db/schema";
import {
    X,
    Utensils,
    Car,
    Film,
    Zap,
    Package,
    Wallet,
    CalendarClock
} from "lucide-react";

interface SelectTransactionModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
}

type TransactionType = "expense" | "income";

const CATEGORY_MAP = {
    expense: [
        { id: 'food', label: 'อาหาร', icon: Utensils },
        { id: 'transportation', label: 'เดินทาง', icon: Car },
        { id: 'utilities', label: 'บิลต่างๆ', icon: Zap },
        { id: 'entertainment', label: 'บันเทิง', icon: Film },
        { id: 'other', label: 'อื่นๆ', icon: Package },
    ],
    income: [
        { id: 'salary', label: 'เงินเดือน', icon: Wallet },
        { id: 'other', label: 'อื่นๆ', icon: Package },
    ]
};

const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function SelectTransactionModal({ transaction, isOpen, onClose, onSuccess }: SelectTransactionModalProps) {
    const [type, setType] = useState<TransactionType>("expense");
    const [category, setCategory] = useState<string>("food");
    const [amount, setAmount] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    useEffect(() => {
        if (transaction && isOpen) {
            setType(transaction.type as TransactionType);
            setCategory(transaction.category);
            setAmount(String(transaction.amount));
            setDescription(transaction.description || "");
            setCreatedAt(new Date(transaction.createdAt));
            setShowDatePicker(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [transaction, isOpen]);

    if (!transaction || !isOpen) return null;

    const handleTypeChange = (newType: TransactionType) => {
        setType(newType);
        setCategory(CATEGORY_MAP[newType][0].id);
    };

    const isDataChanged =
        type !== transaction.type ||
        category !== transaction.category ||
        Number(amount) !== transaction.amount ||
        description !== (transaction.description || "") ||
        createdAt.getTime() !== new Date(transaction.createdAt).getTime();

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0) {
            toast.error("กรุณาระบุจำนวนเงินที่ถูกต้อง");
            return;
        }

        const transactionData = {
            ...transaction,
            type,
            category,
            amount: Number(amount),
            description: description.trim() || undefined,
            createdAt,
            updatedAt: new Date()
        };

        const parseResult = transactionsInsertSchema.safeParse(transactionData);
        if (!parseResult.success) {
            console.error("Validation error:", parseResult.error);
            toast.error("ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
            return;
        }

        try {
            await toast.promise(
                updateTransaction(parseResult.data), {
                loading: "กำลังอัปเดต...",
                success: "อัปเดตรายการสำเร็จ!",
                error: "เกิดข้อผิดพลาดในการอัปเดต"
            });
            await onSuccess();
            onClose();
        } catch (error) {
            console.error("Update error:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`ต้องการลบรายการนี้ใช่หรือไม่?`)) return;
        try {
            await toast.promise(
                deleteTransaction(transaction.id), {
                loading: "กำลังลบ...",
                success: "ลบรายการสำเร็จ!",
                error: "เกิดข้อผิดพลาดในการลบ"
            });
            await onSuccess();
            onClose();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const currentCategories = CATEGORY_MAP[type];

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all"
        >
            <div
                className="bg-[var(--surface)] p-6 rounded-2xl w-full max-w-md shadow-xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">แก้ไขรายการ</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] rounded-full transition-colors outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex p-1 bg-[var(--surface-secondary)] rounded-xl">
                        <button
                            type="button"
                            onClick={() => handleTypeChange("expense")}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === "expense" ? "bg-[var(--surface)] text-red-500 shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
                        >
                            รายจ่าย
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange("income")}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${type === "income" ? "bg-[var(--surface)] text-emerald-500 shadow-sm" : "text-[var(--muted)] hover:text-[var(--foreground)]"}`}
                        >
                            รายรับ
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-3">หมวดหมู่</label>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                            {currentCategories.map((cat) => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategory(cat.id)}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${isSelected
                                            ? "border-[var(--accent)] bg-[var(--surface-secondary)] text-[var(--foreground)] shadow-sm"
                                            : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]/50 hover:bg-[var(--surface-secondary)]/50"
                                            }`}
                                    >
                                        <Icon className={`w-6 h-6 ${isSelected ? (type === 'expense' ? 'text-red-500' : 'text-emerald-500') : ''}`} />
                                        <span className="text-[10px] font-medium">{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">จำนวนเงิน (บาท)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full bg-[var(--surface)] text-[var(--foreground)] text-lg px-4 py-3 rounded-xl border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50"
                        />
                    </div>

                    <div className="bg-[var(--surface-secondary)]/50 p-3 rounded-xl border border-[var(--border)]">
                        {!showDatePicker ? (
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-[var(--foreground)]">วันและเวลา</span>
                                    <span className="text-xs text-[var(--muted)]">
                                        {createdAt.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDatePicker(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:bg-[var(--border)]/50 transition-colors"
                                >
                                    <CalendarClock className="w-3.5 h-3.5" />
                                    เปลี่ยนเวลา
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-[var(--foreground)]">ระบุวันและเวลา</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowDatePicker(false)}
                                        className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] underline underline-offset-2"
                                    >
                                        ยุบ
                                    </button>
                                </div>
                                <input
                                    type="datetime-local"
                                    value={formatLocalDateTime(createdAt)}
                                    onChange={(e) => setCreatedAt(new Date(e.target.value))}
                                    className="w-full bg-[var(--surface)] text-[var(--foreground)] text-sm px-4 py-2.5 rounded-xl border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                            บันทึกช่วยจำ <span className="text-[var(--muted)] font-normal text-xs">(ไม่จำเป็น)</span>
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="รายละเอียดเพิ่มเติม..."
                            className="w-full bg-[var(--surface)] text-[var(--foreground)] text-sm px-4 py-3 rounded-xl border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all placeholder:text-[var(--muted)]/50"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            type="submit"
                            disabled={!isDataChanged}
                            className={`w-full py-3.5 px-4 rounded-xl text-white font-medium transition-all focus:ring-4 focus:ring-opacity-50 disabled:opacity-40 disabled:cursor-not-allowed ${type === 'expense'
                                ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                                : 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500'
                                }`}
                        >
                            บันทึกการแก้ไข
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-2.5 text-sm text-red-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                        >
                            ลบรายการนี้
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}