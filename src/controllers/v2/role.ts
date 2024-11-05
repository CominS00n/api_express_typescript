import { Request, Response } from "express";

import { db } from "../../config/connect";
import { role } from "../../models/roles";

export const role_get = async (req: Request, res: Response) => {
  try {
    const roles = await db.select().from(role).execute();
    res.status(200).json({ message: "Role found", data: roles, status: 200 });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({ message: "Error getting role", status: 500 });
  }
};
