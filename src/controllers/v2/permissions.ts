import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connectDB";
import { permission } from "../../models/permissions";

import logActivity, { LogActivity } from "../../middleware/createLog";

export const permissions_get = async (req: Request, res: Response) => {
  try {
    const permissions = await db.select().from(permission).execute();
    res.status(200).json({ message: "Permissions found", data: permissions, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Permissions not found", status: 404 });
  }
};

export const permissions_get_by_id = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    const permissionFound = await db
      .select()
      .from(permission)
      .where(eq(permission.id, id))
      .execute();
    if (permissionFound.length === 0) {
      res.status(404).json({ message: "Permission not found", status: 404 });
    }
    res.status(200).json({
      message: "Permission found",
      data: permissionFound,
      status: 200,
    });
  } catch (error) {
    res.status(404).json({ message: "Permission not found", status: 404 });
  }
};

export const permissions_post = async (req: Request, res: Response) => {
  try {
    let logData: LogActivity = {
      activityUser: req.cookies.user.name,
      activityDetails: "Permission created",
      activityDate: new Date().toISOString(),
    };
    await db.insert(permission).values(req.body).execute();
    await logActivity(logData);
    res.status(201).json({ message: "Permission created", status: 201 });
  } catch (error) {
    res.status(500).json({ message: "Permission creation failed", status: 500 });
  }
};
