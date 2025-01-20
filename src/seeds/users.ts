import { db } from "../config/connect";
import { users } from "../models/users/users";
import { group } from "../models/users/group";
import { role } from "../models/role_permissions/roles";
import { userGroup } from "../models/users/user_groups";
import { permission } from "../models/role_permissions/permissions";
import { rolePermission } from "../models/role_permissions/role_permissions";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { userRole } from "../models/users/user_roles";
import fs from "fs";

type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  position: string;
  company: string;
  division: string;
  phone: string;
};

export const usersSeeds = async () => {
  const user_data = fs.readFileSync(
    "./src/seeds/seed_data/user_seed.json",
    "utf8"
  );
  const parsedData: User[] = JSON.parse(user_data);
  const hashedUsers = await Promise.all(
    parsedData.map(async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
      return user;
    })
  );

  // create data for user, role, group, permission
  await db
    .insert(permission)
    .values([
      { name: "allowAll", description: "allow all" },
      { name: "userCreate", description: "create user" },
      { name: "userRead", description: "read user" },
      { name: "userUpdate", description: "update user" },
      { name: "userDelete", description: "delete user" },
      { name: "roleCreate", description: "create role" },
      { name: "roleUpdate", description: "update role" },
      { name: "roleDelete", description: "delete role" },
      { name: "reqAccountRead", description: "read request account" },
      { name: "reqAccountUpdate", description: "update request account" },
      { name: "reqAccountDelete", description: "delete request account" },
      { name: "groupCreate", description: "create group" },
      { name: "groupUpdate", description: "update group" },
      { name: "groupDelete", description: "delete group" },
      { name: "implementorCreate", description: "create implementor" },
      { name: "implementorUpdate", description: "update implementor" },
      { name: "implementorDelete", description: "delete implementor" },
      { name: "logRead", description: "read log" },
    ])
    .execute();
  const user_result = await db
    .insert(users)
    .values(hashedUsers)
    .returning({ user_id: users.id })
    .execute();
  const role_result = await db
    .insert(role)
    .values({ name: "super_admin", description: "administrator" })
    .returning({ role_id: role.id })
    .execute();
  const group_result = await db
    .insert(group)
    .values({ name: "super_admin", description: "administrator" })
    .returning()
    .execute();
  const permissions = await db
    .select()
    .from(permission)
    .where(eq(permission.name, "allowAll"))
    .execute();

  // set permission for role, user, group
  await db
    .insert(rolePermission)
    .values({
      role_id: role_result[0].role_id,
      permission_id: permissions[0].id,
    })
    .execute();

  // set user role and user group
  await Promise.all(
    user_result.map(async (user) => {
      return await db
        .insert(userRole)
        .values({
          user_id: user.user_id,
          role_id: role_result[0].role_id,
        })
        .execute();
    })
  );
  await Promise.all(
    user_result.map(async (user) => {
      return await db
        .insert(userGroup)
        .values({
          user_id: user.user_id,
          group_id: group_result[0].id,
        })
        .execute();
    })
  );
};
