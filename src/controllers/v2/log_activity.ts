import { Request, Response } from "express";

import { db } from "../../config/connect";
import { log_activity } from "../../models/log_activity";

export const log_activity_get = async (req: Request, res: Response) => {
  try {
    const activities = await db
      .select({
        activityUser: log_activity.activityUser,
        activityDetails: log_activity.activityDetails,
        activityDate: log_activity.activityDate,
      })
      .from(log_activity)
      .groupBy(log_activity.activityUser, log_activity.activityDetails, log_activity.activityDate)
      .execute();
    res
      .status(200)
      .json({ message: "Activities found", data: activities, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Activities not found", status: 404 });
  }
};
