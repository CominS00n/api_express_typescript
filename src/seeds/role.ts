import { db } from "../config/connect";
import { role } from "../models/role_permissions/roles";
// import {rolePermission} from "../models/role_permissions";

export const roleSeeds = async () => {
  await db
    .insert(role)
    .values([
      { name: "super-admin", description: "administrator" },
      { name: "admin", description: "admin" },
      { name: "user", description: "user" },
    ])
    .execute();
};
