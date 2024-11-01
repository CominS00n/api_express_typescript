import {
  pgTable,
  varchar,
  serial,
  integer,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const permission = pgTable("permission", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const role = pgTable("role", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

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

export const permissionRelation = relations(permission, ({ many }) => ({
  roles: many(rolePermission),
}));

export const roleRelation = relations(role, ({ many }) => ({
  permissions: many(rolePermission),
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
