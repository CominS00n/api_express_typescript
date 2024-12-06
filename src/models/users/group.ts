import { pgTable, serial, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const group = pgTable("group", {
  id: uuid("group_id").primaryKey().defaultRandom(),
  name: varchar("group_name", { length: 100 }).unique(),
  description: varchar("description", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
