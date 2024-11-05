import { db } from "../config/connectDB";
import { rolePermission } from "../models/role_permissions";

export const rolePermissionSeeds = async () => {
  await db
    .insert(rolePermission)
    .values({ role_id: 1, permission_id: 1 })
    .execute();
};
