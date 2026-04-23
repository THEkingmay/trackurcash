'use server'
import { transactions } from "@/src/db/schema"
import { db } from "@/src/db"
import { eq, and, gte, lte, asc } from "drizzle-orm"
import { NewTransaction } from "@/src/db/types";

export async function getTransactionsByDate({ date, profileId }: { date: string | Date, profileId: string }) {
    try {
        if (!date || !profileId) {
            throw new Error("Date and profileId are required")
        }

        const targetDate = new Date(date);

        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const transactionsData = await db.select()
            .from(transactions)
            .where(
                and(
                    eq(transactions.profileId, profileId),
                    gte(transactions.createdAt, startOfDay),
                    lte(transactions.createdAt, endOfDay)
                )
            ).orderBy(asc(transactions.createdAt));

        return transactionsData;
    } catch (error) {
        console.error("Error fetching transactions by date:", error);
        throw error;
    }
}

export async function addTransaction({ profileId, type, category, amount, description, createdAt }: NewTransaction) {
    try {
        await db.insert(transactions).values({
            profileId: profileId,
            type: type,
            category: category,
            amount: amount,
            description: description,
            createdAt: createdAt || new Date(),
            updatedAt: new Date(),
        }).returning();
        return { success: true };
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
    }
}