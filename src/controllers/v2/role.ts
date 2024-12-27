import { Request, Response } from "express";

import { db } from "../../config/connect";
import { role } from "../../models/role_permissions/roles";

export const role_get = async (req: Request, res: Response) => {
  try {
    const roles = await db.select().from(role).execute();
    res.status(200).json({ message: "Role found", data: roles, status: 200 });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({ message: "Error getting role", status: 500 });
  }
};

export const role_post = async (req: Request, res: Response) => {
  type Role = {
    name: string;
    description: string;
  };
  try {
    const { role_name, role_description } = req.body;
    const roleData: Role = { name: role_name, description: role_description };
    const roleInsert = await db
      .insert(role)
      .values(roleData)
      .returning()
      .execute();
    res
      .status(200)
      .json({ message: "Role created", data: roleInsert, status: 200 });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role", status: 500 });
  }
};
