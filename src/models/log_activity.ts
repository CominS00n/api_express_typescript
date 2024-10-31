import { pgTable, serial, varchar, timestamp, date } from "drizzle-orm/pg-core";

export const log_activity = pgTable("log_activity", {
  id: serial("id").primaryKey(),
  activityUser: varchar("activity_user", { length: 100 }).notNull(),
  activityDetails: varchar("activity_details", { length: 100 }).notNull(),
  activityDate: date("activity_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
