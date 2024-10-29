import { Request, Response, Router } from "express";

import { db } from "../../config/connectDB";
import { log_activity } from "../../schema/log_activity";

import { authenticateToken } from "../../middleware/authenticateToken";

const route = Router();

route.get(
  "/log_activity",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const activities = await db.select().from(log_activity).execute();
      res.json({ data: activities, status: 200 });
    } catch (error) {
      console.error("Error getting activities:", error);
      res
        .status(500)
        .json({ error: "Error getting activities", message: error });
    }
  }
);

export default route;
