import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { checkPermissions } from "../middleware/checkPermission";

import * as acc from "../controllers/v2/account_request";
import * as user from "../controllers/v2/users";
import * as auth from "../controllers/v2/auth";
import * as log from "../controllers/v2/log_activity";
import * as perm from "../controllers/v2/permissions";
import * as role from "../controllers/v2/role";
import * as rolePermission from "../controllers/v2/role_permission";
import * as approved from "../controllers/v2/approved";

const route = Router();

//path: /login, /logout and /register
route.post("/login", auth.login);
route.post("/logout", authenticateToken, auth.logout);
route.post(
  "/register",
  [authenticateToken, checkPermissions(["userCreate"])],
  auth.register
);

// path: /users
route.get(
  "/users",
  [authenticateToken, checkPermissions(["userRead"])],
  user.users_get
);
route.get(
  "/users/:id",
  [authenticateToken, checkPermissions(["userRead"])],
  user.users_get_id
);
route.post(
  "/users",
  [authenticateToken, checkPermissions(["userCreate"])],
  user.users_post
);
route.delete(
  "/users/:id",
  [authenticateToken, checkPermissions(["userUpdate"])],
  user.users_delete
);

// path: /account_request
route.get(
  "/account_request",
  [authenticateToken, checkPermissions(["reqAccountCreate"])],
  acc.account_request_get
);
route.get("/account_request/:id", acc.account_request_get_id);
route.post("/account_request", acc.account_request_post);
route.delete(
  "/account_request/:id",
  [authenticateToken, checkPermissions(["reqAccountDelete"])],
  acc.account_request_delete
);
route.put("/account_request", approved.approved_put);

//path: /permissions
route.get(
  "/permissions",
  [authenticateToken, checkPermissions(["permRead"])],
  perm.permissions_get
);
route.get(
  "/permissions/:id",
  [authenticateToken, checkPermissions(["permRead"])],
  perm.permissions_get_by_id
);
route.post(
  "/permissions",
  [authenticateToken, checkPermissions(["permCreate"])],
  perm.permissions_post
);

//path: /role
route.get(
  "/roles",
  [authenticateToken, checkPermissions(["roleRead"])],
  role.role_get
);
route.get(
  "/role-perm",
  [authenticateToken, checkPermissions(["rolePermRead"])],
  rolePermission.role_perm_get
);

//path: /log_activity
route.get(
  "/log_activity",
  [authenticateToken, checkPermissions(["logRead"])],
  log.log_activity_get
);

export default route;
