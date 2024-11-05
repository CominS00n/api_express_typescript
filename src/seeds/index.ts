import { permissionSeeds } from "./permission";
import { roleSeeds } from "./role";
import { rolePermissionSeeds } from "./role_permission";
import { usersSeeds } from "./users";

const seeds = async () => {
  await permissionSeeds();
  await roleSeeds();
  await rolePermissionSeeds();
  await usersSeeds();
};

seeds();
