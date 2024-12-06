import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { group } from "./group";
import { users } from "./users";

export const userGroup = pgTable("user_group", {
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  group_id: uuid("group_id")
    .notNull()
    .references(() => group.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const groupRelation = relations(group, ({ many }) => ({
  users: many(userGroup),
}));

export const userRelation = relations(users, ({ many }) => ({
  groups: many(userGroup),
}));

export const userGroupRelations = relations(userGroup, ({ one }) => ({
  group: one(group, {
    fields: [userGroup.group_id],
    references: [group.id],
  }),
  user: one(users, {
    fields: [userGroup.user_id],
    references: [users.id],
  }),
}));
