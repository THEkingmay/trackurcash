import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
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

export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    name: text("name").notNull(),
    color_code: text("color_code").notNull(),
    is_default: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const profilesSelectSchema = createSelectSchema(profiles);
export const profilesInsertSchema = createInsertSchema(profiles);
export const profilesUpdateSchema = createUpdateSchema(profiles, {
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    name: z.string(),
    color_code: z.string(),
    is_default: z.boolean(),
});