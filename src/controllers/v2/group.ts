import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { group } from "../../models/users/group";

export const group_get_id = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const groupData = await db
      .select()
      .from(group)
      .where(eq(group.id, id))
      .execute();
    res
      .status(200)
      .json({ message: "Group found", data: groupData, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Group not found", status: 404 });
  }
};

export const group_get_all = async (req: Request, res: Response) => {
  try {
    const groupData = await db.select().from(group).execute();
    res
      .status(200)
      .json({ message: "Groups found", data: groupData, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Groups not found", status: 404 });
  }
};

export const group_post = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const groupData = await db
      .insert(group)
      .values({ name, description })
      .execute();
    res
      .status(200)
      .json({ message: "Group created", data: groupData, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Group not created", status: 404 });
  }
};
