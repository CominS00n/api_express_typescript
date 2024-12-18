import {
  pgTable,
  text,
  varchar,
  date,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { account_type, req_type, status } from "..";

// Define the table schema
export const account_request = pgTable("account_request", {
  id: uuid("acc_req_id").primaryKey().defaultRandom(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }).notNull(),
  division: varchar("division", { length: 100 }).notNull(),
  telephone: varchar("telephone", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  req_type: req_type("req_type").notNull(),
  system: varchar("system").array().notNull(),
  req_date: date("req_date").notNull(),
  account_type: account_type("account_type").notNull(),
  expiry_date: date("expiry_date"),
  service_type: text("service_type").array().notNull(), // array of text
  user_type: text("user_type").array().notNull(), // array of text
  status: status("status").default("Pending").notNull(),
  remarks: text("req_remarks"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
