import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { account_request } from "../../models/req_acc/account_request";
import { approved } from "../../models/req_acc/approved";

import logActivity, { LogActivity } from "../../middleware/createLog";

export const account_request_get = async (req: Request, res: Response) => {
  try {
    const account_requests = await db
      .select()
      .from(account_request)
      .leftJoin(approved, eq(account_request.id, approved.acc_req_id))
      .execute();
    
    const result = account_requests.reduce((acc: any[], item: any) => {
      const { account_request, approved } = item;

      const existingRequest = acc.find((req) => req.id === account_request.id);

      if (existingRequest) {
        existingRequest.approved.push(approved);
      } else {
        acc.push({
          ...account_request,
          approved: approved ? [approved] : [],
        });
      }

      return acc;
    }, []);
    res.status(200).json({
      message: "Account requests found",
      data: result,
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
    const result_req_acc = req_data.account_request;
    const approved_acc = req_data.approved_result;
    const data = await db
      .insert(account_request)
      .values(result_req_acc)
      .returning()
      .execute();

    const id = data[0].id;
    for (const x in approved_acc) {
      await db
        .insert(approved)
        .values({ ...approved_acc[x], acc_req_id: id })
        .execute();
    }

    // let logData: LogActivity = {
    //   activityUser: req_data.full_name,
    //   activityDetails: "Account request created",
    //   activityDate: new Date().toISOString(),
    // };

    // await logActivity(logData);

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
