import { db } from "./config/connectDB";
import {
  createUsersTable,
  dropUsersTable,
} from "./migrations/20241021_create_users_table";
import {
  createPermissionTable,
  dropPermissionTable,
} from "./migrations/20241021_create_permission_table";
import {
  createUserPermissionTable,
  dropUserPermissionTable,
} from "./migrations/20241021_create_user_permission";

const migrations = [
  { up: createUsersTable, down: dropUsersTable },
  { up: createPermissionTable, down: dropPermissionTable },
  { up: createUserPermissionTable, down: dropUserPermissionTable },
];

const runMigrations = async () => {
  console.log("Starting migrations...");

  // Rollback existing tables
  for (const migration of migrations) {
    try {
      await migration.down(db);
      console.log(`Rolled back migration: ${migration.down.name}`);
    } catch (error) {
      console.error(
        `Not found table: ${migration.down.name}`
      );
    }
  }

  // Apply new migrations
  for (const migration of migrations) {
    try {
      await migration.up(db);
      console.log(`Applied migration: ${migration.up.name}`);
    } catch (error) {
      console.error(`Failed to apply migration: ${migration.up.name}`, error);
      break;
    }
  }

  console.log("Migrations completed.");
};

runMigrations();
