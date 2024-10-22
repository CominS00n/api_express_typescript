import { Router } from "express";
import permission from "./permission";
import users from "./users";
import login from "./login";
import log_activity from "./log_activity";

const route = Router();

route.use("/", [users, permission, login, log_activity]);

export default route;
