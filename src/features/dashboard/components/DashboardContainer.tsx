'use client'
import UserHeader from "./UserHeader"
import TodaySummary from "./TodaySummary"
import TodayTransaction from "./TodayTransaction"

import { useAuth } from "@/src/hooks/auth/AuthProvider";
import { useState } from "react";
import { Transaction } from "@/src/db/types";
import { getTransactionsByDate } from "../action";

export default function DashboardContainer() {
    const { loading, user, profiles, currentProfile } = useAuth()
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchTransactions = async () => {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        // Client จะได้เวลา 00:00 น. ของไทย

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        // Client จะได้เวลา 23:59 น. ของไทย

        if (!currentProfile) return;
        try {
            const transactionsData = await getTransactionsByDate({
                startDate: startOfDay,
                endDate: endOfDay,
                profileId: currentProfile?.id
            });
            setTransactions(transactionsData);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };
    return (
        <main className="bg-[var(--background)] text-[var(--foreground)] py-5  max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
                <UserHeader loading={loading} user={user} profiles={profiles} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                <div className="w-full md:col-span-2">
                    <TodayTransaction
                        currentDate={selectedDate}
                        currentProfileId={currentProfile?.id || ""}
                        setSelectedDate={setSelectedDate}
                        fetchTransactions={fetchTransactions}
                        transactions={transactions}
                    />
                </div>
                <div className="w-full md:col-span-1">
                    <TodaySummary currentDate={selectedDate} transactions={transactions} />
                </div>
            </div>
        </main>
    )
}
