import {
  pgTable,
  serial,
  varchar,
  date,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { account_request } from "./account_request";
import { relations } from "drizzle-orm";

import { status } from "..";

export const approved = pgTable("approved", {
  id: serial("approve_id").primaryKey(),
  acc_req_id: integer("acc_req_id")
    .notNull()
    .references(() => account_request.id),
  type: varchar("approved_type", { length: 50 }).notNull(),
  name: varchar("approved_name", { length: 100 }).notNull(),
  email: varchar("approved_email", { length: 150 }).notNull(),
  signature: text("approved_signature"),
  remark: text("approved_remark"),
  status: status("approved_status").default("Pending").notNull(),
  date: date("approved_date"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// relations 1 to many
export const accountRequestRelation = relations(account_request, ({ many }) => ({
  approved: many(approved),
}));

export const approvedRelations = relations(approved, ({ one }) => ({
  accountRequest: one(account_request, {
    fields: [approved.acc_req_id],
    references: [account_request.id],
  }),
}));

