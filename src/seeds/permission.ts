import { db } from "../config/connectDB";
import { permission } from "../models/permission";

export const permissionSeeds = async () => {
  await db
    .insert(permission)
    .values([
      { name: "create" },
      { name: "read" },
      { name: "update" },
      { name: "delete" },
    ])
    .execute();
};
