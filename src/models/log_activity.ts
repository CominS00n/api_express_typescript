import { pgTable, varchar, timestamp, date, uuid, text } from "drizzle-orm/pg-core";

export const log_activity = pgTable("log_activity", {
  id: uuid("log_id").primaryKey().defaultRandom(),
  activityCode: varchar("activity_code", { length: 2 }).notNull(),
  activityUser: varchar("activity_user", { length: 100 }).notNull(),
  activityAction: varchar("activity_action", { length: 100 }).notNull(),
  activityDetails: text("activity_details").notNull(),
  activityDate: date("activity_date").notNull().defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  deleted_at: timestamp("deleted_at"),
});
