import { z } from "zod";
import { usersInsertSchema, usersSelectSchema, usersUpdateSchema } from "./schema";

export type User = z.infer<typeof usersSelectSchema>;
export type NewUser = z.infer<typeof usersInsertSchema>;
export type UpdateUser = z.infer<typeof usersUpdateSchema>;