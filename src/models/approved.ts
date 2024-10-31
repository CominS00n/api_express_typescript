import { pgTable, serial, varchar, date, timestamp } from "drizzle-orm/pg-core";
import { account_request } from "./account_request";

import { status } from "./after_create";

export const approved = pgTable("approved", {
  id: serial("id").primaryKey(),
  account_request_id: serial("account_request_id")
    .notNull()
    .references(() => account_request.id),
  head_of_requestor: status("head_of_requestor").default("Pending"),
  head_of_requestor_remarks: varchar("head_of_requestor_remarks", {
    length: 100,
  }),
  head_of_requestor_date: date("head_of_requestor_date"),
  implementor: status("implementor").default("Pending"),
  implementor_remarks: varchar("implementor_remarks", { length: 100 }),
  implementor_date: date("implementor_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
