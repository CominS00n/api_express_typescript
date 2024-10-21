import { pgTable, varchar, serial, timestamp } from "drizzle-orm/pg-core";

export const permission = pgTable("permission", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 100 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
