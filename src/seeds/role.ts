import { db } from "../config/connectDB";
import { role, rolePermission } from "../models/permission";

export const roleSeeds = async () => {
  await db
    .insert(role)
    .values([{ name: "admin" }, { name: "user" }])
    .execute();
};

export const rolePermissionSeeds = async () => {
  await db
    .insert(rolePermission)
    .values([
      { role_id: 1, permission_id: 1 },
      { role_id: 1, permission_id: 2 },
      { role_id: 1, permission_id: 3 },
      { role_id: 1, permission_id: 4 },
      { role_id: 2, permission_id: 2 },
      { role_id: 2, permission_id: 3 },
    ])
    .execute();
};
