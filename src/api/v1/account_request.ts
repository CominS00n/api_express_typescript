import { Router, Request, Response } from "express";

import { db } from "../../config/connectDB";
import { account_request } from "../../schema/account_request";

import logActivity, { LogActivity } from "../../middleware/createLog";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/account_request", async (req: Request, res: Response) => {
  try {
    const account_requests = await db.select().from(account_request).execute();
    res.status(200).json(account_requests);
  } catch (error) {
    console.error("Error getting account_request:", error);
    res
      .status(500)
      .json({ error: "Error getting account_request", message: error });
  }
});

router.post("/account_request", async (req: Request, res: Response) => {
  try {
    const req_data = req.body;

    await db.insert(account_request).values(req_data).execute();

    let logData: LogActivity = {
      activityUser: req_data.full_name,
      activityDetails: "Account request created",
      activityDate: new Date().toISOString(),
    };

    logActivity(logData);

    res.status(200).json({ message: "Account request created" });
  } catch (error) {
    console.error("Error creating account_request:", error);
    res
      .status(500)
      .json({ error: "Error creating account_request", message: error });
  }
});

router.delete("/account_request/:id", async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    await db
      .delete(account_request)
      .where(eq(account_request.id, id))
      .execute();
    res.status(200).json({ message: "Account request deleted" });
  } catch (error) {
    console.error("Error deleting account_request:", error);
    res
      .status(500)
      .json({ error: "Error deleting account_request", message: error });
  }
});

export default router;
