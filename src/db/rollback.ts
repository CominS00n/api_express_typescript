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

  await db.execute(`DROP TYPE IF EXISTS req_type;`);
  await db.execute(`DROP TYPE IF EXISTS account_type;`);
  await db.execute(`DROP TYPE IF EXISTS status;`)

  console.log("Migrations completed.");
};

runRollback();
