import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const role = pgTable("role", {
  id: serial("role_id").primaryKey(),
  name: varchar("role_name", { length: 100 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
