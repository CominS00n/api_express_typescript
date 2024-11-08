import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const group = pgTable("group", {
  id: serial("group_id").primaryKey(),
  name: varchar("group_name", { length: 100 }).unique(),
  description: varchar("description", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
