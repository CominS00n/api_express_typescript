import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/connect";
import { users } from "../models/users/users";
import { userRole } from "../models/users/user_roles";
import { role } from "../models/role_permissions/roles";
import { permission } from "../models/role_permissions/permissions";
import { rolePermission } from "../models/role_permissions/role_permissions";

export const checkPermissions =
  (permissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleResult = await db
        .select()
        .from(rolePermission)
        .innerJoin(role, eq(role.id, rolePermission.role_id))
        .innerJoin(permission, eq(permission.id, rolePermission.permission_id))
        .innerJoin(userRole, eq(userRole.role_id, role.id))
        .innerJoin(users, eq(users.id, userRole.user_id))
        .execute();

      const arrPermission = roleResult.map((role) => role.permission.name);
      const checkPermission = permissions.every(
        (permission) =>
          arrPermission.includes(permission) ||
          arrPermission.includes("allowAll")
      );
      if (checkPermission) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden", status: 403 });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", status: 500 });
    }
  };
