import { Request, Response } from "express";
import { and, eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { approved } from "../../models/req_acc/approved";
import { account_request } from "../../models/req_acc/account_request";

import { sendMail } from "./send_email";
import { subjectEnum } from "../../types/enum";
import { ccMail } from "../../middleware/ccMail";

// const cc = process.env.MAIL_CC || "";

export const approved_put = async (req: Request, res: Response) => {
  const cc: string[] = [];
  await ccMail().then((res) => {
    if (res) {
      cc.push(...res);
    }
  });
  try {
    const result = req.body;
    const status = result.status as "Pending" | "Approved" | "Rejected";

    if (status === "Rejected") {
      try {
        await db
          .update(account_request)
          .set({ status: status })
          .where(eq(account_request.id, result.acc_req_id))
          .execute();
        await db
          .update(approved)
          .set({ status: "Rejected" })
          .where(
            and(
              eq(approved.acc_req_id, result.acc_req_id),
              eq(approved.name, result.name),
              eq(approved.email, result.email)
            )
          )
          .execute();
        await sendMail(result, cc, subjectEnum.REJECT);
      } catch (error) {
        console.error(error);
      }
      res.status(200).json({ message: "Rejected", status: 200 });
      return;
    }

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
    await sendMail(result, cc, subjectEnum.UPDATE);

    if (response.length === 0) {
      res.status(404).json({ message: "No approved found", status: 404 });
      return;
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
        await sendMail(data[0], cc, subjectEnum.REQUEST);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await db
          .update(account_request)
          .set({ status: "Approved" })
          .where(eq(account_request.id, result.acc_req_id))
          .returning()
          .execute();
        await sendMail(result, cc, subjectEnum.APPROVED);
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
