import { Request, Response } from "express";
import { eq, isNull } from "drizzle-orm";

import { db } from "../../config/connect";
import { account_request } from "../../models/req_acc/account_request";
import { approved } from "../../models/req_acc/approved";
import { sendMail } from "./send_email";

import { subjectEnum } from "../../types/enum";
import { ccMail } from "../../middleware/ccMail";

export const account_request_get = async (req: Request, res: Response) => {
  try {
    const account_requests = await db
      .select()
      .from(account_request)
      .leftJoin(approved, eq(account_request.id, approved.acc_req_id))
      .where(isNull(approved.deleted_at))
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

export const account_request_get_id = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const account_requests = await db
      .select()
      .from(account_request)
      .leftJoin(approved, eq(account_request.id, approved.acc_req_id))
      .where(eq(account_request.id, id))
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
    console.error("Error updating approved:", error);
    res.status(500).json({ message: "Error updating approved", status: 500 });
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

    const emailData = await db
      .select()
      .from(approved)
      .where(eq(approved.acc_req_id, id))
      .limit(1)
      .execute();

    //! Send email
    try {
      const cc: string[] = [];
      await ccMail().then((res) => {
        if (res) {
          cc.push(...res);
        }
      });

      await sendMail(emailData[0], cc, subjectEnum.REQUEST);
      await sendMail(emailData[0], cc, subjectEnum.WAITING);

      // logActivity("CR", req.cookies.name, "Create", "Account request created");
    } catch (error) {
      console.error(error);
    }
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
    const id: string = req.params.id;
    await db
      .update(account_request)
      .set({ deleted_at: new Date() })
      .where(eq(account_request.id, id))
      .execute();

    res.status(200).json({ message: "Account request deleted", status: 200 });
  } catch (error) {
    console.error("Error deleting account_request:", error);
    res
      .status(500)
      .json({ message: "Error deleting account_request", status: 500 });
  }
};

export const account_request_put = async (req: Request, res: Response) => {
  try {
    const req_data = req.body;
    const id: string = req.params.id;
    await db
      .update(account_request)
      .set({ remarks: req_data.remarks })
      .where(eq(account_request.id, id))
      .execute();

    res.status(200).json({ message: "Account request updated", status: 200 });
  } catch (error) {
    console.error("Error updating account_request:", error);
    res
      .status(500)
      .json({ message: "Error updating account_request", status: 500 });
  }
};
