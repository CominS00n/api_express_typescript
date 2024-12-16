import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/connect";
import { users } from "../models/users/users";
import { role } from "../models/role_permissions/roles";
import { permission } from "../models/role_permissions/permissions";
import { rolePermission } from "../models/role_permissions/role_permissions";
import { userRole } from "../models/users/user_roles";

export const checkPermissions =
  (permissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleUserLogin = await db
        .select()
        .from(userRole)
        .leftJoin(role, eq(role.id, userRole.role_id))
        .where(eq(userRole.user_id, req.cookies.user.id))
        .limit(1)
        .execute();
      const roleData = roleUserLogin[0].role?.name;
      const result = await db
        .select({
          name: role.name,
          permission: permission.name,
        })
        .from(rolePermission)
        .leftJoin(role, eq(role.id, rolePermission.role_id))
        .leftJoin(permission, eq(permission.id, rolePermission.permission_id))
        .where(eq(role.name, roleData || ""))
        .execute();
      // convert result to array
      const arrPermission = result.map((role) => role.permission);
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
