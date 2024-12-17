import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const implementor = pgTable("implementor", {
  id: uuid("implementor_id").primaryKey().defaultRandom(),
  name: varchar("implementor_name", { length: 100 }).notNull(),
  email: varchar("implementor_email", { length: 150 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
