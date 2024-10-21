import { db } from "../../config/connectDB";
import { permission } from "../../schema/permission";
import { Request, Response, Router } from "express";
import { eq } from "drizzle-orm";

const route = Router();

route.get("/permissions", async (req: Request, res: Response) => {
  try {
    const allPermissions = await db.select().from(permission).execute();
    if (allPermissions.length === 0) {
      res.status(404).json({ error: "No permissions found" });
    }
    res.json(allPermissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res
      .status(500)
      .json({ error: "Error fetching permissions", message: error });
  }
});

route.get("/permissions/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const permissionFound = await db
      .select()
      .from(permission)
      .where(eq(permission.id, id))
      .execute();
    if (permissionFound.length === 0) {
      res.status(404).json({ error: "Permission not found" });
    }
    res.json({ message: "Permission found", data: permissionFound });
  } catch (error) {
    console.error("Error fetching permission:", error);
    res
      .status(500)
      .json({ error: "Error fetching permission", message: error });
  }
});

route.post("/permissions", async (req: Request, res: Response) => {
  try {
    await db.insert(permission).values(req.body).execute();
    res.status(201).json({ message: "Permission created" });
  } catch (error) {
    console.error("Error creating permission:", error);
    res
      .status(500)
      .json({ error: "Error creating permission", message: error });
  }
});

export default route;
