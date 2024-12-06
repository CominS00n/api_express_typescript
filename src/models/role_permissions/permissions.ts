import { pgTable, varchar, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const permission = pgTable("permission", {
  id: uuid("perm_id").primaryKey().defaultRandom(),
  name: varchar("perm_name", { length: 100 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
