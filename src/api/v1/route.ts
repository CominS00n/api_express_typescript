import { Router } from "express";
import permission from "./permission";
import users from "./users";
import login from "./login";
import log_activity from "./log_activity";
import account_request from "./account_request";

const route = Router();

route.use("/", [users, permission, login, log_activity, account_request]);

export default route;
