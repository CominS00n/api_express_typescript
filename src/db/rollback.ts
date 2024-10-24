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
import {
  createAccountRequestTable,
  dropAccountRequestTable,
} from "../migrations/20241024_create_acccount_request_table";

const migrations = [
  { up: createUsersTable, down: dropUsersTable },
  { up: createPermissionTable, down: dropPermissionTable },
  {
    up: createUserPermissionTable,
    down: dropUserPermissionTable,
  },
  { up: createLogActivityTable, down: dropLogActivityTable },
  { up: createAccountRequestTable, down: dropAccountRequestTable },
];

const runRollback = async () => {
  console.log("Starting migrations...");

  for (const migration of migrations) {
    try {
      if (migration.down === undefined) {
        continue;
      }
      await migration.down(db);
      console.log(`Rolled back migration: ${migration.down.name}`);
    } catch (error) {
      console.error(`Not found table: ${migration.down.name}`);
    }
  }

  console.log("Migrations completed.");
};

runRollback();
