import { pgTable, serial, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const role = pgTable("role", {
  id: uuid("role_id").primaryKey().defaultRandom(),
  name: varchar("role_name", { length: 100 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
