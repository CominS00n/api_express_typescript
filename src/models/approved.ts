import { pgTable, serial, varchar, date, timestamp } from "drizzle-orm/pg-core";
import { account_request } from "./account_request";

import { status } from "./create_types";

export const approved = pgTable("approved", {
  id: serial("id").primaryKey(),
  account_request_id: serial("account_request_id")
    .notNull()
    .references(() => account_request.id),
  requestor_name: varchar("requestor_name", { length: 100 }),
  requestor_status: status("requestor_status").default("Pending"),
  requestor_remarks: varchar("requestor_remarks", {
    length: 100,
  }),
  requestor_date: date("requestor_date"),
  implementor_name: varchar("implementor_name", { length: 100 }),
  implementor_status: status("implementor").default("Pending"),
  implementor_remarks: varchar("implementor_remarks", { length: 100 }),
  implementor_date: date("implementor_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
