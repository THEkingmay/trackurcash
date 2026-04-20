import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema, createUpdateSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").unique().notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const usersSelectSchema = createSelectSchema(users);
export const usersInsertSchema = createInsertSchema(users);
export const usersUpdateSchema = createUpdateSchema(users, {
    id: z.string(),
    email: z.email(),
    createdAt: z.date(),
});
