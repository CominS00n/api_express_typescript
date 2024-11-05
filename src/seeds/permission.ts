import { db } from "../config/connectDB";
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

// list permissionSeeds
// 0. name allowAll   description allow all
// 1. name userCreate  description create user
// 2. name userRead    description read user
// 3. name userUpdate  description update user
// 4. name userDelete  description delete user
// 5. name roleCreate  description create role
// 6. name roleRead    description read role
// 7. name roleUpdate  description update role
// 8. name roleDelete  description delete role
// 9. name permCreate  description create permission
// 10. name permRead   description read permission
// 11. name permUpdate description update permission
// 12. name permDelete description delete permission
// 17. name rolePermCreate description create role permission
// 18. name rolePermRead description read role permission
// 19. name rolePermUpdate description update role permission
// 20. name rolePermDelete description delete role permission
// 21. name reqAccountCreate description create request account
// 22. name reqAccountRead description read request account
// 23. name reqAccountUpdate description update request account
// 24. name reqAccountDelete description delete request account
// 25. name logRead description read log
