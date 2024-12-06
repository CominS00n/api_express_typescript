import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { role } from "../role_permissions/roles";
import { users } from "./users";

export const userRole = pgTable("user_role", {
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role_id: uuid("role_id")
    .notNull()
    .references(() => role.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const roleRelation = relations(role, ({ many }) => ({
  users: many(userRole),
}));

export const userRelation = relations(users, ({ many }) => ({
  roles: many(userRole),
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
  role: one(role, {
    fields: [userRole.role_id],
    references: [role.id],
  }),
  user: one(users, {
    fields: [userRole.user_id],
    references: [users.id],
  }),
}));
