import {
  pgTable,
  serial,
  text,
  varchar,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enumerated types
const req_type = pgEnum("req_type", [
  "New Account",
  "Terminate",
  "Reset Password",
  "Change",
]);
const account_type = pgEnum("account_type", ["Permanent", "Temporary"]);
const status = pgEnum("status", ["Pending", "Approved", "Rejected"]);

// Define the table schema
export const account_request = pgTable("account_request", {
  id: serial("id").primaryKey(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }).notNull(),
  division: varchar("division", { length: 100 }).notNull(),
  telephone: varchar("telephone", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  req_type: req_type("req_type").notNull(),
  system: varchar("system", { length: 100 }).notNull(),
  req_date: date("req_date").notNull(),
  account_type: account_type("account_type").notNull(),
  expiry_date: date("expiry_date"),
  service_type: text("service_type").array().notNull(), // array of text
  user_type: text("user_type").array().notNull(), // array of text
  status: status("status").default("Pending").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
