import { relations } from "drizzle-orm";
import { pgTable, integer, timestamp } from "drizzle-orm/pg-core";
import { role } from "./roles";
import { permission } from "./permissions";

export const rolePermission = pgTable("role_permission", {
  role_id: integer("role_id")
    .notNull()
    .references(() => role.id),
  permission_id: integer("permission_id")
    .notNull()
    .references(() => permission.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const roleRelation = relations(role, ({ many }) => ({
  permissions: many(rolePermission),
}));

export const permissionRelation = relations(permission, ({ many }) => ({
  roles: many(rolePermission),
}));

export const rolePermissionRelations = relations(rolePermission, ({ one }) => ({
  role: one(role, {
    fields: [rolePermission.role_id],
    references: [role.id],
  }),
  permission: one(permission, {
    fields: [rolePermission.permission_id],
    references: [permission.id],
  }),
}));
