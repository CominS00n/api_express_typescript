import { permissionSeeds } from "./permission";
import { roleSeeds, rolePermissionSeeds } from "./role";
import { usersSeeds } from "./users";

const seeds = async () => {
  await permissionSeeds();
  await roleSeeds();
  await rolePermissionSeeds();
  await usersSeeds();
};

seeds();
