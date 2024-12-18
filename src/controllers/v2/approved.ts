import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { approved } from "../../models/req_acc/approved";
import { account_request } from "../../models/req_acc/account_request";
import { sendMail } from "../../middleware/sendEmail";
import type { em } from "../../types";
import logActivity, { activityCode } from "../../middleware/createLog";

export const approved_put = async (req: Request, res: Response) => {
  try {
    const result = req.body;
    const status = result.status as "Pending" | "Approved" | "Rejected";

    const response = await db
      .update(approved)
      .set({ status: status, ...result })
      .where(
        and(
          eq(approved.acc_req_id, result.acc_req_id),
          eq(approved.name, result.name),
          eq(approved.email, result.email)
        )
      )
      .returning()
      .execute();
    if (response.length === 0) {
      res.status(404).json({ message: "No approved found", status: 404 });
      return;
    }

    if (status === "Rejected") {
      try {
        await db
          .update(account_request)
          .set({ status: "Rejected" })
          .where(eq(account_request.id, result.acc_req_id))
          .execute();

        // create log
        logActivity(activityCode.APPROVED, result.name, "Rejected", "Rejected");
      } catch (error) {
        console.error(error);
      }
      res.status(200).json({ message: "Rejected", status: 200 });
      return;
    } else {
    }
    const data = await db
      .select()
      .from(approved)
      .where(
        and(
          eq(approved.acc_req_id, result.acc_req_id),
          eq(approved.status, "Pending")
        )
      )
      .limit(1)
      .execute();

    if (data.length !== 0) {
      try {
        const from: string = "spuckpoo@gmail.com";
        const to: string = `${data[0].email}`;
        const subject: string = "New Account Request";
        const mailTemplate: em = {
          em_id: result.acc_req_id,
          em_name: data[0].name,
        };
        const cc: string = "";
        sendMail(from, to, subject, mailTemplate, cc);

        // create log
        logActivity(
          activityCode.APPROVED,
          data[0].name,
          "Approved",
          "Approved"
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await db
          .update(account_request)
          .set({ status: "Approved" })
          .where(eq(account_request.id, result.acc_req_id))
          .execute();
      } catch (error) {
        console.error(error);
      }
    }

    res.status(200).json({ message: "Approved updated", data, status: 200 });
  } catch (error) {
    console.error("Error updating approved:", error);
    res.status(500).json({ message: "Error updating approved", status: 500 });
  }
};
