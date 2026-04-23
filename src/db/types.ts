import { z } from "zod";
import { usersInsertSchema, usersSelectSchema, usersUpdateSchema } from "./schema";
import { profilesInsertSchema, profilesSelectSchema, profilesUpdateSchema } from "./schema";
import { transactionsInsertSchema, transactionsSelectSchema, transactionsUpdateSchema } from "./schema";

export type User = z.infer<typeof usersSelectSchema>;
export type NewUser = z.infer<typeof usersInsertSchema>;
export type UpdateUser = z.infer<typeof usersUpdateSchema>;

export type Profile = z.infer<typeof profilesSelectSchema>;
export type NewProfile = z.infer<typeof profilesInsertSchema>;
export type UpdateProfile = z.infer<typeof profilesUpdateSchema>;

export type Transaction = z.infer<typeof transactionsSelectSchema>;
export type NewTransaction = z.infer<typeof transactionsInsertSchema>;
export type UpdateTransaction = z.infer<typeof transactionsUpdateSchema>;