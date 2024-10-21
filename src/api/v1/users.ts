import { eq } from "drizzle-orm";
import { db } from "../../config/connectDB";
import { users, user_permission } from "../../schema/users";
import express, { Request, Response } from "express";
import crypto from "crypto";

const route = express.Router();

route.get("/users", async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users).execute();
    res.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users", message: error });
  }
});

route.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .execute();
    res.json({ message: "User found", data: user, status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user", message: error });
  }
});

// user permission routes
route.get("/user_permissions", async (req: Request, res: Response) => {
  try {
    const allUserPermissions = await db
      .select()
      .from(user_permission)
      .execute();
    res.json(allUserPermissions);
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    res
      .status(500)
      .json({ error: "Error fetching user permissions", message: error });
  }
});
route.post("/user_permissions", async (req: Request, res: Response) => {
  try {
    await db.insert(user_permission).values(req.body).execute();
    res.status(201).json({ message: "User permission created" });
  } catch (error) {
    console.error("Error creating user permission:", error);
    res
      .status(500)
      .json({ error: "Error creating user permission", message: error });
  }
});

export default route;
