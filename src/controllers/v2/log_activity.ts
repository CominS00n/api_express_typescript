import { Request, Response } from "express";

import { db } from "../../config/connectDB";
import { log_activity } from "../../models/log_activity";

export const log_activity_get = async (req: Request, res: Response) => {
  try {
    const activities = await db.select().from(log_activity).execute();
    res.status(200).json({ message: "Activities found", data: activities, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Activities not found", status: 404 });
  }
};
