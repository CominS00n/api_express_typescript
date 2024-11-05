import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { role } from "./roles";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  role_id: integer("role_id").notNull().references(() => role.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
