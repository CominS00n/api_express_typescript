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
import * as implementor from "../controllers/v2/implementor";
import * as group from "../controllers/v2/group";

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
route.get(
  "/users/group/:group",
  [authenticateToken, checkPermissions(["userRead"])],
  user.get_users_by_group
);
route.post(
  "/users",
  [authenticateToken, checkPermissions(["userCreate"])],
  user.users_post
);
route.delete(
  "/users/:id",
  [authenticateToken, checkPermissions(["userDelete"])],
  user.users_delete
);
route.put(
  "/users/:id",
  [authenticateToken, checkPermissions(["userUpdate"])],
  user.users_put
);

// path: /account_request
route.get("/account_request/:id", acc.account_request_get_id);
route.post("/account_request", acc.account_request_post);
route.put("/account_request/:id", acc.account_request_put);
route.put("/account_request", approved.approved_put);
route.get(
  "/account_request",
  [authenticateToken, checkPermissions(["reqAccountRead"])],
  acc.account_request_get
);
route.delete(
  "/account_request/:id",
  [authenticateToken, checkPermissions(["reqAccountDelete"])],
  acc.account_request_delete
);

//path: /permissions
route.get("/permissions", perm.permissions_get);
route.get("/permissions/:id", perm.permissions_get_by_id);
// route.post("/permissions", perm.permissions_post);

//path: /role
route.get("/roles", role.role_get);
route.get("/role-perm/:id", rolePermission.role_perm_get_by_id);
route.post(
  "/roles",
  [authenticateToken, checkPermissions(["roleCreate"])],
  role.role_post
);
route.delete(
  "/roles/:id",
  [authenticateToken, checkPermissions(["roleDelete"])],
  role.role_delete
);
route.put(
  "/roles/:id",
  [authenticateToken, checkPermissions(["roleUpdate"])],
  role.role_put
);
route.get(
  "/role-perm",
  [authenticateToken, checkPermissions(["rolePermRead"])],
  rolePermission.role_perm_get
);

// path: /group
route.get("/groups", group.group_get_all);
route.get("/group/:id", group.group_get_id);
route.post(
  "/group",
  [authenticateToken, checkPermissions(["groupCreate"])],
  group.group_post
);
route.delete(
  "/group/:id",
  [authenticateToken, checkPermissions(["groupDelete"])],
  group.group_delete
);
route.put(
  "/group/:id",
  [authenticateToken, checkPermissions(["groupUpdate"])],
  group.group_put
);

//path: /log_activity
route.post("/log_activity", log.log_activity_post);
route.get("/log_activity", log.log_activity_get);

// path: /implementor
route.get("/implementor", implementor.getImplementor);
route.get("/implementor/:id", implementor.getImplementorById);
route.post("/implementor", implementor.createImplementor);
route.put("/implementor/:id", implementor.updateImplementor);
route.delete("/implementor/:id", implementor.deleteImplementor);

export default route;
