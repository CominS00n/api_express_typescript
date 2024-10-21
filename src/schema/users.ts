import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { permission } from "./permission";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const user_permission = pgTable("user_permission", {
  id: serial("id").primaryKey(),
  user_id: serial("user_id")
    .notNull()
    .references(() => users.id),
  permission_id: serial("permission_id")
    .notNull()
    .references(() => permission.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
