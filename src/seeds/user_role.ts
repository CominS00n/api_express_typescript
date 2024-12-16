import { db } from "../config/connect";
import { userRole } from "../models/users/user_roles";

export const userRoleSeeds = async () => {
  await db
    .insert(userRole)
    .values({ user_id: '1', role_id: '1' })
    .execute();
};
