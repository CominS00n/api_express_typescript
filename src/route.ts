import { Router } from "express";
import permission from "./controllers/v1/permission";
import users from "./controllers/v1/users";
import login from "./controllers/v1/login";
import log_activity from "./controllers/v1/log_activity";
import account_request from "./controllers/v1/account_request";

const route = Router();

const api_route = [users, permission, login, log_activity, account_request];

route.use("/", api_route);

export default route;
