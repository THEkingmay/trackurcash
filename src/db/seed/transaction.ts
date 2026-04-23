import dotenv from "dotenv";
dotenv.config();

import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { db } from ".."; // ปรับ path ให้ตรงกับโครงสร้างโฟลเดอร์ของเม
import { transactions } from "../schema";
import { NewTransaction } from "../types";

async function runSeed() {
    const rl = readline.createInterface({ input, output });

    try {
        console.log("🌱 Starting Transaction Seeder...");

        const profileID = await rl.question("👉 Enter Profile ID to seed transactions for: ");

        if (!profileID.trim()) {
            console.log("❌ Error: Profile ID cannot be empty.");
            return;
        }

        console.log(`\n⏳ Seeding data for profile: ${profileID}...`);

        const sampleTransactions: NewTransaction[] = [
            {
                profileId: profileID,
                type: "income",
                category: "other",
                amount: 5000,
                description: "Salary for June 2024",
            },
            {
                profileId: profileID,
                type: "expense",
                category: "food",
                amount: 1500,
                description: "Groceries for the week",
            },
            {
                profileId: profileID,
                type: "expense",
                category: "entertainment",
                amount: 800,
                description: "Movie night with friends",
            }
        ];

        await db.insert(transactions).values(sampleTransactions);

        console.log("✅ Seeding completed successfully!");

    } catch (error) {
        console.error("❌ Error seeding transactions:", error);
    } finally {
        rl.close();
        process.exit(0);
    }
}

runSeed();