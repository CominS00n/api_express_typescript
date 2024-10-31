import express, { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connectDB";
import { users, user_permission } from "../../models/users";
import { permission } from "../../models/permission";

import { authenticateToken } from "../../middleware/authenticateToken";
import logActivity, { LogActivity } from "../../middleware/createLog";

const route = express.Router();

route.get("/users", authenticateToken, async (req: Request, res: Response) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .execute();
    // let logData: LogActivity = {
    //   activityUser: req.cookies.user.name,
    //   activityDetails: "Users fetched",
    //   activityDate: new Date().toISOString(),
    // };
    // await logActivity(logData);
    res.json({data: allUsers, status: 200});
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users", message: error });
  }
});
route.get(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
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
      // let logData: LogActivity = {
      //   activityUser: req.cookies.user.name,
      //   activityDetails: "Users fetched",
      //   activityDate: new Date().toISOString(),
      // };
      // await logActivity(logData);
      res.json({ message: "User found", data: user, status: 200 });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Error fetching user", message: error });
    }
  }
);
route.delete(
  "/users/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      await db.delete(users).where(eq(users.id, id)).execute();
      let logData: LogActivity = {
        activityUser: req.cookies.user.name,
        activityDetails: "User deleted",
        activityDate: new Date().toISOString(),
      };
      await logActivity(logData);
      res.json({ message: "User deleted", logData });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Error deleting user", message: error });
    }
  }
);

// user permission routes
route.get(
  "/user_permissions",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const allUserPermissions = await db
        .select({
          id: user_permission.id,
          username: users.username,
          permission: permission.name,
        })
        .from(user_permission)
        .innerJoin(users, eq(user_permission.user_id, users.id))
        .innerJoin(permission, eq(user_permission.permission_id, permission.id))
        .execute();
      // let logData: LogActivity = {
      //   activityUser: req.cookies.user.name,
      //   activityDetails: "User permissions fetched",
      //   activityDate: new Date().toISOString(),
      // };
      // await logActivity(logData);
      res.json(allUserPermissions);
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      res
        .status(500)
        .json({ error: "Error fetching user permissions", message: error });
    }
  }
);
route.post(
  "/user_permissions",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      await db.insert(user_permission).values(req.body).execute();
      // get username from cookie
      const logData: LogActivity = {
        activityUser: req.cookies.user.name,
        activityDetails: "User permission created",
        activityDate: new Date().toISOString(),
      };
      await logActivity(logData);
      res.status(201).json({ message: "User permission created", logData });
    } catch (error) {
      console.error("Error creating user permission:", error);
      res
        .status(500)
        .json({ error: "Error creating user permission", message: error });
    }
  }
);
route.delete(
  "/user_permissions/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id);
      await db
        .delete(user_permission)
        .where(eq(user_permission.id, id))
        .execute();

      const logData: LogActivity = {
        activityUser: req.cookies.user.name,
        activityDetails: "User permission deleted",
        activityDate: new Date().toISOString(),
      };

      await logActivity(logData);
      res.json({ message: "User permission deleted" });
    } catch (error) {
      console.error("Error deleting user permission:", error);
      res
        .status(500)
        .json({ error: "Error deleting user permission", message: error });
    }
  }
);

export default route;
