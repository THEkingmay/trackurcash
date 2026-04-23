'use server'
import { transactions } from "@/src/db/schema"
import { db } from "@/src/db"
import { eq, and, gte, lte, asc } from "drizzle-orm"
import { NewTransaction, UpdateTransaction } from "@/src/db/types";
import { transactionsUpdateSchema } from "@/src/db/schema";

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

export async function updateTransaction({ id, profileId, type, category, amount, description, createdAt }: NewTransaction) {
    try {
        const pasredUpdateTransaction = transactionsUpdateSchema.safeParse({ id, profileId, type, category, amount, description, createdAt, updatedAt: new Date() })
        if (!pasredUpdateTransaction.success) {
            console.error("[Validation error] : ", pasredUpdateTransaction.error);
            throw new Error("Invalid transaction data")
        }

        await db.update(transactions).set({
            profileId: pasredUpdateTransaction.data.profileId,
            type: pasredUpdateTransaction.data.type,
            category: pasredUpdateTransaction.data.category,
            amount: pasredUpdateTransaction.data.amount,
            description: pasredUpdateTransaction.data.description,
            createdAt: pasredUpdateTransaction.data.createdAt,
            updatedAt: pasredUpdateTransaction.data.updatedAt,
        }).where(eq(transactions.id, pasredUpdateTransaction.data.id)).returning();
        return { success: true };
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
}

export async function deleteTransaction(transactionId: string) {
    try {
        await db.delete(transactions).where(eq(transactions.id, transactionId));
        return { success: true };
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}