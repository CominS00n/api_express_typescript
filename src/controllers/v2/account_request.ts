import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { account_request } from "../../models/req_acc/account_request";
import { approved } from "../../models/req_acc/approved";
import { sendMail } from "../../middleware/sendEmail";

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

export const account_request_get_id = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);
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
      const from: string = "spuckpoo@gmail.com";
      const to: string = `${emailData[0].email}`;
      const subject: string = "New Account Request";
      // const mailTemplate: string =
      //   `<h1>New Account Request</h1> <a href="http://localhost:3000/test-data/${id}">Google</a>`;
      const mailTemplate: string = `
      <div class="container">
        <h2>ยืนยันการสร้างบัญชีของคุณ</h2>
        <p>เรียนคุณ ${emailData[0].name},</p>
        <a href="https://rtc-template-frontend.vercel.app/approval/${id}">Approved or Reject Account</a>
        <p>กรุณาดำเนินการยืนยันภายใน 24 ชั่วโมง มิฉะนั้นคำขอจะถูกยกเลิกโดยอัตโนมัติ</p>
        <div class="footer">
            <p>ขอแสดงความนับถือ,</p>
            <p>[ชื่อทีม/องค์กร]</p>
            <p>[อีเมลติดต่อ] | [เบอร์โทรติดต่อ (ถ้ามี)]</p>
        </div>
    </div>
    `;
      const cc: string = "spuckpooforwork@gmail.com";
      sendMail(from, to, subject, mailTemplate, cc);
    } catch (error) {
      console.error(error);
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
