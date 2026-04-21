import { z } from "zod";
import { usersInsertSchema, usersSelectSchema, usersUpdateSchema } from "./schema";
import { profilesInsertSchema, profilesSelectSchema, profilesUpdateSchema } from "./schema";

export type User = z.infer<typeof usersSelectSchema>;
export type NewUser = z.infer<typeof usersInsertSchema>;
export type UpdateUser = z.infer<typeof usersUpdateSchema>;

export type Profile = z.infer<typeof profilesSelectSchema>;
export type NewProfile = z.infer<typeof profilesInsertSchema>;
export type UpdateProfile = z.infer<typeof profilesUpdateSchema>;