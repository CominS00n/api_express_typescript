import { usersSeeds } from "./users";
import { db } from "../config/connect";
import { log_activity } from "../models/log_activity";

const seeds = async () => {
  await usersSeeds().finally(async () => {
    await db
      .insert(log_activity)
      .values({
        activityCode: "SYSTEM_CREATE" + new Date().getTime(),
        activityUser: "Server system",
        activityAction: "Create administer users",
        activityDetails: "System create default administer users",
      })
      .execute();
    console.log("Seeds completed");
  });
};

seeds();
