import { db } from "../config/connectDB";
import { log_activity } from "../models/log_activity";

export type LogActivity = {
  activityUser: string;
  activityDetails: string;
  activityDate: string;
};

export default async function logActivity(data: LogActivity) {
  try {
    await db.insert(log_activity).values(data).execute();
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
