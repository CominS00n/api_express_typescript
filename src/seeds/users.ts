import { db } from "../config/connect";
import { users } from "../models/users/users";
import { group } from "../models/users/group";
import { role } from "../models/role_permissions/roles";
import { userGroup } from "../models/users/user_groups";
import { permission } from "../models/role_permissions/permissions";
import { rolePermission } from "../models/role_permissions/role_permissions";

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { userRole } from "../models/users/user_roles";

export const usersSeeds = async () => {
  const username: string = "admin";
  const password: string = "admin";
  const name: string = "sitthihai puckpoo";
  const email: string = "spuckpoo@gmail.com";
  const hashedPassword: string = await bcrypt.hash(password, 10);
  const phone = "0812345678";
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
  const user_result = await db
    .insert(users)
    .values({
      username: username,
      password: hashedPassword,
      name: name,
      email: email,
      phone: phone,
    })
    .returning()
    .execute();
  const role_result = await db
    .insert(role)
    .values({ name: "super-admin", description: "administrator" })
    .returning()
    .execute();
  const group_result = await db
    .insert(group)
    .values({ name: "admin", description: "administrator" })
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
      role_id: role_result[0].id,
      permission_id: permissions[0].id,
    })
    .execute();
  await db
    .insert(userRole)
    .values({
      user_id: user_result[0].id,
      role_id: role_result[0].id,
    })
    .execute();
  await db
    .insert(userGroup)
    .values({ user_id: user_result[0].id, group_id: group_result[0].id })
    .execute();
};
