import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Transaction } from "@/src/db/types";
import AddTransactionModal from "@/src/components/AddTransactionModal";
import Button from "@/src/components/Button";
import {
    CalendarDays,
    Plus,
    Utensils,
    Car,
    Film,
    Zap,
    Package,
    Wallet,
    ReceiptText
} from "lucide-react";
import toast from "react-hot-toast";

interface TodayTransactionProps {
    currentDate: Date;
    currentProfileId: string;
    setSelectedDate: Dispatch<SetStateAction<Date>>;
    fetchTransactions: () => Promise<void>;
    transactions: Transaction[];
}

const getCategoryIcon = (category: Transaction['category']) => {
    switch (category) {
        case 'food': return <Utensils className="w-[18px] h-[18px]" />;
        case 'transportation': return <Car className="w-[18px] h-[18px]" />;
        case 'entertainment': return <Film className="w-[18px] h-[18px]" />;
        case 'utilities': return <Zap className="w-[18px] h-[18px]" />;
        case 'salary': return <Wallet className="w-[18px] h-[18px]" />;
        case 'other':
        default: return <Package className="w-[18px] h-[18px]" />;
    }
};

const formatThaiTime = (dateInput: Date | string) => {
    return new Date(dateInput).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Bangkok'
    });
};

export default function TodayTransaction({ currentDate, currentProfileId, setSelectedDate, fetchTransactions, transactions }: TodayTransactionProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        if (!currentProfileId) return;
        const loadTransactions = async () => {
            setIsLoading(true);
            try {
                await fetchTransactions();
            } catch (error) {
                console.error("Error loading transactions:", error);
                toast.error("Failed to load transactions");
            } finally {
                setIsLoading(false);
            }
        };
        loadTransactions();
    }, [currentDate, currentProfileId]);

    const dateString = currentDate.toLocaleDateString('en-CA');

    return (
        <div className="bg-[var(--surface)] px-6 pb-3 rounded-2xl border border-[var(--border)] max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
            <div className="flex flex-col sticky top-0  bg-[var(--surface)] pt-6 pb-3 border-b border-[var(--border)]    sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <CalendarDays className="w-5 h-5 text-[var(--muted)]" />
                    <h2 className="text-xl font-semibold tracking-tight">รายการวันนี้</h2>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={dateString}
                        onChange={(e) => {
                            if (e.target.value) {
                                setSelectedDate(new Date(e.target.value));
                            }
                        }}
                        className="bg-[var(--surface-secondary)] text-[var(--foreground)] text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                    />
                    <Button onClick={() => setIsModalOpen(true)} variant={'primary'} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl">
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">เพิ่มรายการ</span>
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="w-6 h-6 border-2 border-[var(--muted)] border-t-[var(--accent)] rounded-full animate-spin"></div>
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-secondary)]/30">
                    <ReceiptText className="w-8 h-8 text-[var(--muted)] mb-3 opacity-50" />
                    <p className="text-[var(--foreground)] font-medium text-sm">ยังไม่มีรายการ</p>
                    <p className="text-[var(--muted)] text-xs mt-1">กดเพิ่มรายการเพื่อบันทึกรายรับรายจ่ายของวันนี้</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {transactions.map((transaction) => {
                        const isExpense = transaction.type === "expense";
                        const amountColor = isExpense ? "text-red-500" : "text-emerald-500";
                        const amountPrefix = isExpense ? "-" : "+";

                        return (
                            <li
                                key={transaction.id}
                                className="group flex justify-between items-center p-4 bg-transparent hover:bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface-secondary)] text-[var(--muted)] group-hover:bg-[var(--surface)] transition-colors">
                                        {getCategoryIcon(transaction.category)}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium text-[var(--foreground)] leading-none">
                                            {transaction.description || "ไม่ระบุรายละเอียด"}
                                        </p>
                                        <p className="text-xs text-[var(--muted)]">
                                            {formatThaiTime(transaction.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <p className={`text-base font-semibold tracking-tight ${amountColor}`}>
                                    {amountPrefix}{Math.abs(transaction.amount).toLocaleString()} ฿
                                </p>
                            </li>
                        );
                    })}
                </ul>
            )}

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                profileId={currentProfileId}
                onSuccess={() => fetchTransactions()}
            />
        </div>
    );
}