import { db } from "../config/connectDB";
import { role } from "../models/roles";
// import {rolePermission} from "../models/role_permissions";

export const roleSeeds = async () => {
  await db
    .insert(role)
    .values({ name: "super-admin", description: "administrator" })
    .execute();
};
