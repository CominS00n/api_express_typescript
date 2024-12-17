import { permissionSeeds } from "./permission";
import { roleSeeds } from "./role";
import { rolePermissionSeeds } from "./role_permission";
import { usersSeeds } from "./users";
import { userRoleSeeds } from "./user_role";
import { groupSeeds, userGroupSeeds } from "./user_group";

const seeds = async () => {
  // await permissionSeeds();
  // await roleSeeds();
  // await rolePermissionSeeds();
  await usersSeeds();
  // await groupSeeds();
  // await userRoleSeeds();
  // await userGroupSeeds();
};

seeds();
