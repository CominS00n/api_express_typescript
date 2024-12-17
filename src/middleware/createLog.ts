import { db } from "../config/connect";
import { log_activity } from "../models/log_activity";

export enum activityCode {
  CREATE = "CR",
  READ = "RD",
  UPDATE = "UP",
  DELETE = "DL",
  LOGIN = "LI",
  LOGOUT = "LO",
  APPROVED = "AP",
}
type LogActivity = {
  activityCode: activityCode;
  activityUser: string;
  activityAction: string;
  activityDetails: string;
};

export default async function logActivity(
  code: activityCode,
  name: string,
  action: string,
  details: string
) {
  const data: LogActivity = {
    activityCode: code,
    activityUser: name,
    activityAction: action,
    activityDetails: details,
  };
  try {
    await db.insert(log_activity).values(data).execute();
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}
