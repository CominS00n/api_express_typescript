import {
  pgTable,
  serial,
  varchar,
  date,
  pgEnum,
  timestamp,
} from "drizzle-orm/pg-core";
import { account_request } from "./account_request";

const approve_status = pgEnum("status", ["Pending", "Approved", "Rejected"]);

export const approved = pgTable("approved", {
  id: serial("id").primaryKey(),
  account_request_id: serial("account_request_id")
    .notNull()
    .references(() => account_request.id),
  head_of_requestor: approve_status("head_of_requestor").default("Pending"),
  head_of_requestor_remarks: varchar("head_of_requestor_remarks", {
    length: 100,
  }),
  head_of_requestor_date: date("head_of_requestor_date"),
  implementor: approve_status("implementor").default("Pending"),
  implementor_remarks: varchar("implementor_remarks", { length: 100 }),
  implementor_date: date("implementor_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
