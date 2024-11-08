import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { users } from "../../models/users/users";

import logActivity, { LogActivity } from "../../middleware/createLog";

import { role } from "../../models/role_permissions/roles";
import { permission } from "../../models/role_permissions/permissions";
import { rolePermission } from "../../models/role_permissions/role_permissions";

export const users_get = async (req: Request, res: Response) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
        role: role.name,
        permission: permission.name,
      })
      .from(users)
      .innerJoin(rolePermission, eq(users.role_id, rolePermission.role_id))
      .leftJoin(role, eq(role.id, rolePermission.role_id))
      .leftJoin(permission, eq(permission.id, rolePermission.permission_id))
      .execute();

    const result = allUsers.reduce((acc: any[], row: any) => {
      let user = acc.find((r: any) => r.id === row.id);

      if (!user) {
        user = {
          id: row.id,
          name: row.name,
          username: row.username,
          email: row.email,
          role: row.role,
          permission: [],
        };
        acc.push(user);
      }

      if (row.permission) {
        user.permission.push(row.permission);
      }
      return acc;
    }, []);

    res
      .status(200)
      .json({ message: "Users found", data: result, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "User not found", status: 404 });
  }
};

export const users_get_id = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, id))
      .execute();
    res.status(200).json({ message: "User found", data: user, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "User not found", status: 404 });
  }
};

export const users_post = async (req: Request, res: Response) => {
  try {
    await db.insert(users).values(req.body).execute();
    let logData: LogActivity = {
      activityUser: req.body.name,
      activityDetails: "User created",
      activityDate: new Date().toISOString(),
    };
    await logActivity(logData);
    res.status(201).json({ message: "User created successfully", status: 201 });
  } catch (error) {
    res.status(500).json({ message: "User creation failed", status: 500 });
  }
};

export const users_delete = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    await db.delete(users).where(eq(users.id, id)).execute();
    let logData: LogActivity = {
      activityUser: req.cookies.user.name,
      activityDetails: "User deleted",
      activityDate: new Date().toISOString(),
    };
    await logActivity(logData);
    res.status(200).json({ message: "User deleted successfully", status: 200 });
  } catch (error) {
    res.status(404).json({ message: "User not found", status: 404 });
  }
};

// route.get(
//   "/user_permissions",
//   authenticateToken,
//   async (req: Request, res: Response) => {
//     try {
//       const allUserPermissions = await db
//         .select({
//           id: user_permission.id,
//           username: users.username,
//           permission: permission.name,
//         })
//         .from(user_permission)
//         .innerJoin(users, eq(user_permission.user_id, users.id))
//         .innerJoin(permission, eq(user_permission.permission_id, permission.id))
//         .execute();
//       res.json(allUserPermissions);
//     } catch (error) {
//       console.error("Error fetching user permissions:", error);
//       res
//         .status(500)
//         .json({ error: "Error fetching user permissions", message: error });
//     }
//   }
// );
// route.post(
//   "/user_permissions",
//   authenticateToken,
//   async (req: Request, res: Response) => {
//     try {
//       await db.insert(user_permission).values(req.body).execute();
//       // get username from cookie
//       const logData: LogActivity = {
//         activityUser: req.cookies.user.name,
//         activityDetails: "User permission created",
//         activityDate: new Date().toISOString(),
//       };
//       await logActivity(logData);
//       res.status(201).json({ message: "User permission created", logData });
//     } catch (error) {
//       console.error("Error creating user permission:", error);
//       res
//         .status(500)
//         .json({ error: "Error creating user permission", message: error });
//     }
//   }
// );
// route.delete(
//   "/user_permissions/:id",
//   authenticateToken,
//   async (req: Request, res: Response) => {
//     try {
//       const id: number = parseInt(req.params.id);
//       await db
//         .delete(user_permission)
//         .where(eq(user_permission.id, id))
//         .execute();

//       const logData: LogActivity = {
//         activityUser: req.cookies.user.name,
//         activityDetails: "User permission deleted",
//         activityDate: new Date().toISOString(),
//       };

//       await logActivity(logData);
//       res.json({ message: "User permission deleted" });
//     } catch (error) {
//       console.error("Error deleting user permission:", error);
//       res
//         .status(500)
//         .json({ error: "Error deleting user permission", message: error });
//     }
//   }
// );

// export default route;
