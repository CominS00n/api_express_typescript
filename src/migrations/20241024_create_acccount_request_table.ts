import {pgSchema, pgTable, serial, varchar, text, timestamp, date} from 'drizzle-orm/pg-core';

export const mySchema = pgSchema("my_schema");
export const status = mySchema.enum("status", ["Pending", "Approved", "Rejected"]);
export const req_type = mySchema.enum("req_type", ["New", "Update", "Delete"]);
export const account_type = mySchema.enum("account_type", ["User", "Admin"]);

export const account_request = mySchema.table("account_request", {
  id: serial("id").primaryKey(),
  full_name: varchar("full_name", {length: 100}).notNull(),
  position: varchar("position", {length: 100}).notNull(),
  company: varchar("company", {length: 100}).notNull(),
  division: varchar("division", {length: 100}).notNull(),
  telephone: varchar("telephone", {length: 100}).notNull(),
  email: varchar("email", {length: 100}).notNull(),
  req_type: req_type("req_type").notNull(),
  system: varchar("system", {length: 100}).notNull(),
  req_date: date("req_date").notNull(),
  account_type: account_type("account_type").notNull(),
  expiry_date: date("expiry_date"),
  service_type: text("service_type").array().notNull(),
  user_type: text("user_type").array().notNull(),
  status: status("status").default("Pending").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

