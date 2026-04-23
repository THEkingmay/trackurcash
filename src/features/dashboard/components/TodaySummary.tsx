import { Transaction } from "@/src/db/types";
import {
    TrendingDown,
    TrendingUp,
    Wallet,
    CalendarDays,
    ReceiptText
} from "lucide-react";

interface TodaySummaryProps {
    currentDate: Date;
    transactions: Transaction[];
}

export default function TodaySummary({ currentDate, transactions }: TodaySummaryProps) {
    const totalIncome = transactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const totalExpense = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const balance = totalIncome - totalExpense;

    const formattedDate = new Intl.DateTimeFormat('th-TH', {
        dateStyle: 'long',
        timeZone: 'Asia/Bangkok'
    }).format(currentDate);

    return (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] h-[calc(100vh-200px)]">
            <div className="flex flex-col  justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <CalendarDays className="w-5 h-5 text-[var(--muted)]" />
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">สรุปผลวัน</h2>
                        <h2 className="text-xl font-semibold tracking-tight">{formattedDate}</h2>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-secondary)] rounded-lg text-[var(--muted)] text-sm">
                    <ReceiptText className="w-4 h-4" />
                    <span>{transactions.length} รายการ</span>
                </div>
            </div>

            <div className="grid grid-cols-1  gap-4">
                <div className="flex flex-col p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-md">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-[var(--muted)]">รายรับ</span>
                    </div>
                    <p className="text-2xl font-bold text-emerald-500 tracking-tight">
                        {totalIncome.toLocaleString('th-TH')} <span className="text-sm font-normal">฿</span>
                    </p>
                </div>

                <div className="flex flex-col p-4 bg-[var(--surface-secondary)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-red-500/10 text-red-500 rounded-md">
                            <TrendingDown className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-[var(--muted)]">รายจ่าย</span>
                    </div>
                    <p className="text-2xl font-bold text-red-500 tracking-tight">
                        {totalExpense.toLocaleString('th-TH')} <span className="text-sm font-normal">฿</span>
                    </p>
                </div>

                <div className="flex flex-col p-4 bg-[var(--accent)] text-[var(--background)] rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <div className="p-1.5 bg-white/20 rounded-md">
                            <Wallet className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">ยอดคงเหลือ</span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight">
                        {balance.toLocaleString('th-TH')} <span className="text-sm font-normal">฿</span>
                    </p>
                </div>
            </div>
        </div>
    );
}