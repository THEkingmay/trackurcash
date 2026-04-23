ALTER TABLE "profiles" DROP CONSTRAINT "profiles_name_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_user_id_name_unique" ON "profiles" USING btree ("user_id","name");