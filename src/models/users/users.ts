import { pgTable, varchar, timestamp, serial, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("user_id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 100 }).notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  phone: varchar("phone", { length: 11 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});
