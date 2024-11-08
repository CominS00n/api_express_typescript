import { pgEnum } from "drizzle-orm/pg-core";

export const req_type = pgEnum("req_type", [
  "New Account",
  "Terminate",
  "Reset Password",
  "Change",
]);
export const account_type = pgEnum("account_type", ["Permanent", "Temporary"]);
export const status = pgEnum("status", ["Pending", "Approved", "Rejected"]);
