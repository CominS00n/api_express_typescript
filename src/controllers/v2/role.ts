import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connectDB";
import { role, rolePermission, permission } from "../../models/permissions";

// import logActivity, { LogActivity } from "../../middleware/createLog";

// export const role_get = async (req: Request, res: Response) => {
//   const id: number = parseInt(req.params.roleId);

//   try {
//     const permissions = await db
//       .select()
//       .from(rolePermission)
//       .where(eq(rolePermission.role_id, id))
//       .execute();
//     res
//       .status(200)
//       .json({ message: "Role found", data: permissions, status: 200 });
//   } catch (error) {
//     // console.error("Error getting role:", error);
//     res.status(500).json({ message: "Error getting role", status: 500 });
//   }
// };

export const role_get = async (req: Request, res: Response) => {
  try {
    const rolePermissions = await db
      .select({
        roleId: role.id,
        roleName: role.name,
        roleDescription: role.description,
        roleCreatedAt: role.created_at,
        roleUpdatedAt: role.updated_at,
        permissionId: permission.id,
        permissionName: permission.name,
        permissionDescription: permission.description,
        permissionCreatedAt: permission.created_at,
        permissionUpdatedAt: permission.updated_at,
      })
      .from(role)
      .leftJoin(rolePermission, eq(role.id, rolePermission.role_id))
      .leftJoin(permission, eq(rolePermission.permission_id, permission.id))
      .execute();

    const result = rolePermissions.reduce((acc: any[], row: any) => {
      let role = acc.find((r: any) => r.id === row.roleId);

      if (!role) {
        role = {
          id: row.roleId,
          name: row.roleName,
          description: row.roleDescription,
          created_at: row.roleCreatedAt,
          updated_at: row.roleUpdatedAt,
          permission: [],
        };
        acc.push(role);
      }

      if (row.permissionId) {
        role.permission.push({
          id: row.permissionId,
          name: row.permissionName,
          description: row.permissionDescription,
          created_at: row.permissionCreatedAt,
          updated_at: row.permissionUpdatedAt,
        });
      }
      return acc;
    }, []);

    res.status(200).json({ message: "Role found", data: result, status: 200 });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({ message: "Error getting role", status: 500 });
  }
};
