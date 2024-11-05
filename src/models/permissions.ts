import { pgTable, varchar, serial, text, timestamp } from "drizzle-orm/pg-core";

export const permission = pgTable("permission", {
  id: serial("id").primaryKey(),
  name: varchar("perm_name", { length: 100 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
