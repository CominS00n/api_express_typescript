import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/connectDB";
import { role } from "../models/roles";
import { permission } from "../models/permissions";
import { rolePermission } from "../models/role_permissions";

export const checkPermissions =
  (permissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.cookies.user.role;
    const result = await db
      .select({
        name: role.name,
        permission: permission.name,
      })
      .from(rolePermission)
      .leftJoin(role, eq(role.id, rolePermission.role_id))
      .leftJoin(permission, eq(permission.id, rolePermission.permission_id))
      .where(eq(role.name, userRole))
      .execute();

    // convert result to array
    const arrPermission = result.map((role) => role.permission);
    const checkPermission = permissions.every((permission) =>
      arrPermission.includes(permission) || arrPermission.includes("allowAll")
    );
    if (checkPermission) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden", status: 403 });
    }
  };
