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
import {
  createApprovedTable,
  dropApprovedTable,
} from "../migrations/20241024_create_approved_table";

const migrations = [
  { up: createUsersTable, down: dropUsersTable },
  { up: createPermissionTable, down: dropPermissionTable },
  {
    up: createUserPermissionTable,
    down: dropUserPermissionTable,
  },
  { up: createLogActivityTable, down: dropLogActivityTable },
  { up: createAccountRequestTable, down: dropAccountRequestTable },
  { up: createApprovedTable, down: dropApprovedTable },
];

const runMigrations = async () => {
  console.log("Starting migrations...");
  try {
    await db.execute(`CREATE TYPE req_type AS ENUM ( 'New Account', 'Terminate', 'Reset Password', 'Change' );`);
    await db.execute(`CREATE TYPE account_type AS ENUM ( 'Permanent', 'Temporary' );`);
    await db.execute(`CREATE TYPE status AS ENUM ( 'Pending', 'Approved', 'Rejected' );`);
  } catch (error) {
    console.info(`EXISTS types`);
  }

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
