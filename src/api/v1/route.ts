import express from "express";
import permission from "./permission";
import users from "./users";

const route = express.Router();

export const v1 = route.use("/v1", [users, permission]);