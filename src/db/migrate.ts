import { db } from "../config/connectDB";
import {
  createUsersTable,
  dropUsersTable,
} from "../migrations/20241021_create_users_table";
import {
  createPermissionTable,
  dropPermissionTable,
} from "../migrations/20241021_create_permission_table";
import {
  createUserPermissionTable,
  dropUserPermissionTable,
} from "../migrations/20241021_create_user_permission";
import {
  createLogActivityTable,
  dropLogActivityTable,
} from "../migrations/20241022_create_log_activity";

const migrations = [
  { up: createUsersTable, down: dropUsersTable },
  { up: createPermissionTable, down: dropPermissionTable },
  {
    up: createUserPermissionTable,
    down: dropUserPermissionTable,
  },
  { up: createLogActivityTable, down: dropLogActivityTable },
];

const runMigrations = async () => {
  console.log("Starting migrations...");

  for (const migration of migrations) {
    try {
      await migration.up(db);
      console.log(`Applied migration: ${migration.up.name}`);
    } catch (error) {
      console.error(`Failed to apply migration: ${migration.up.name}`);
    }
  }

  console.log("Migrations completed.");
};

runMigrations();