import { db } from "../config/connect";
import { group } from "../models/users/group";
import { userGroup } from "../models/users/user_groups";

export const groupSeeds = async () => {
  await db
    .insert(group)
    .values([
      { name: "admin", description: "administrator" },
      { name: "user", description: "user" },
    ])
    .execute();
};

export const userGroupSeeds = async () => {
  await db
    .insert(userGroup)
    .values([{ user_id: 1, group_id: 1 }])
    .execute();
};
