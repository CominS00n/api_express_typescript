import { db } from "../config/connect";
import { permission } from "../models/permissions";

export const permissionSeeds = async () => {
  await db
    .insert(permission)
    .values([
      { name: "allowAll", description: "allow all" },
      { name: "userCreate", description: "create user" },
      { name: "userRead", description: "read user" },
      { name: "userUpdate", description: "update user" },
      { name: "userDelete", description: "delete user" },
      { name: "roleCreate", description: "create role" },
      { name: "roleRead", description: "read role" },
      { name: "roleUpdate", description: "update role" },
      { name: "roleDelete", description: "delete role" },
      { name: "permCreate", description: "create permission" },
      { name: "permRead", description: "read permission" },
      { name: "permUpdate", description: "update permission" },
      { name: "permDelete", description: "delete permission" },
      { name: "rolePermCreate", description: "create role permission" },
      { name: "rolePermRead", description: "read role permission" },
      { name: "rolePermUpdate", description: "update role permission" },
      { name: "rolePermDelete", description: "delete role permission" },
      { name: "reqAccountCreate", description: "create request account" },
      { name: "reqAccountRead", description: "read request account" },
      { name: "reqAccountUpdate", description: "update request account" },
      { name: "reqAccountDelete", description: "delete request account" },
      { name: "logRead", description: "read log" },
    ])
    .execute();
};
