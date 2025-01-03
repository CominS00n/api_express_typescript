import { Request, Response } from "express";
import { eq, ne } from "drizzle-orm";

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
    const groupData = await db
      .select()
      .from(group)
      .where(ne(group.name, "super_admin"))
      .execute();
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

export const group_delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(group).where(eq(group.id, id)).execute();
    res.status(200).json({ message: "Group deleted", status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Group not deleted", status: 404 });
  }
};

export const group_put = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await db
      .update(group)
      .set({ name, description })
      .where(eq(group.id, id))
      .execute();
    res.status(200).json({ message: "Group updated", status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Group not updated", status: 404 });
  }
};
