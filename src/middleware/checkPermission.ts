import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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
    const token = req.cookies.token;
    let userAuthId: string;

    if (token == null) {
      res.status(401).json({ message: "Unauthorized", status: 401 });
    }
    try {
      const user = jwt.verify(token, "supersecret");
      if (typeof user !== "string" && "id" in user) {
        userAuthId = user.id;
      } else {
        console.error("Invalid token payload");
        return res.status(401).json({ message: "Unauthorized", status: 401 });
      }
    } catch (error) {
      return res.status(403).json({ message: "Forbidden", status: 403 });
    }

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
      // console.log(roleResult[0].users.id);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", status: 500 });
    }

    // try {
    //   const userRole = req.cookies.user.role;
    //   console.log(userRole);
    //   // console.log(userRole);
    //   const result = await db
    //     .select({
    //       name: role.name,
    //       permission: permission.name,
    //     })
    //     .from(rolePermission)
    //     .leftJoin(role, eq(role.id, rolePermission.role_id))
    //     .leftJoin(permission, eq(permission.id, rolePermission.permission_id))
    //     .where(eq(role.name, userRole))
    //     .execute();
    //   // convert result to array
    //   const arrPermission = result.map((role) => role.permission);
    //   const checkPermission = permissions.every(
    //     (permission) =>
    //       arrPermission.includes(permission) ||
    //       arrPermission.includes("allowAll")
    //   );
    //   if (checkPermission) {
    //     next();
    //   } else {
    //     res.status(403).json({ message: "Forbidden", status: 403 });
    //   }
    // } catch (error) {
    //   res.status(500).json({ message: "Internal server error", status: 500 });
    // }
  };
