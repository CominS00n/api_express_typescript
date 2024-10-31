import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connectDB";
import { account_request } from "../../models/account_request";

import logActivity, { LogActivity } from "../../middleware/createLog";

export const account_request_get = async (req: Request, res: Response) => {
  try {
    const account_requests = await db.select().from(account_request).execute();
    res.status(200).json({
      message: "Account requests found",
      data: account_requests,
      status: 200,
    });
  } catch (error) {
    console.error("Error getting account_request:", error);
    res
      .status(500)
      .json({ message: "Error getting account_request", status: 500 });
  }
};

export const account_request_post = async (req: Request, res: Response) => {
  try {
    const req_data = req.body;

    await db.insert(account_request).values(req_data).execute();

    let logData: LogActivity = {
      activityUser: req_data.full_name,
      activityDetails: "Account request created",
      activityDate: new Date().toISOString(),
    };

    await logActivity(logData);
    res.status(201).json({ message: "Account request created", status: 201 });
  } catch (error) {
    console.error("Error creating account_request:", error);
    res
      .status(500)
      .json({ message: "Error creating account_request", status: 500 });
  }
};

export const account_request_delete = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
    await db
      .delete(account_request)
      .where(eq(account_request.id, id))
      .execute();

    const logData: LogActivity = {
      activityUser: req.cookies.user.name,
      activityDetails: "Account request deleted",
      activityDate: new Date().toISOString(),
    };

    await logActivity(logData);
    res.status(200).json({ message: "Account request deleted", status: 200 });
  } catch (error) {
    console.error("Error deleting account_request:", error);
    res
      .status(500)
      .json({ message: "Error deleting account_request", status: 500 });
  }
};
