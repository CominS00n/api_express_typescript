import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import * as acc from "../controllers/v2/account_request";
import * as user from "../controllers/v2/users";
import * as auth from "../controllers/v2/auth";
import * as log from "../controllers/v2/log_activity";
import * as perm from "../controllers/v2/permissions";

const route = Router();

//path: /login, /logout and /register
route.post("/login", auth.login);
route.post("/logout", authenticateToken, auth.logout);
route.post("/register", authenticateToken, auth.register);

// path: /users
route.get("/users", authenticateToken, user.users_get);
route.get("/users/:id", authenticateToken, user.users_get_id);
route.post("/users", authenticateToken, user.users_post);
route.delete("/users/:id", authenticateToken, user.users_delete);

// path: /account_request
route.get("/account_request", authenticateToken, acc.account_request_get);
route.post("/account_request", acc.account_request_post);
route.delete("/account_request/:id", authenticateToken, acc.account_request_delete);

//path: /permissions
route.get("/permissions", authenticateToken, perm.permissions_get);
route.get("/permissions/:id", authenticateToken, perm.permissions_get_by_id);
route.post("/permissions", authenticateToken, perm.permissions_post);

//path: /log_activity
route.get("/log_activity", authenticateToken, log.log_activity_get);

export default route;
