import nodemailer from "nodemailer";
import winston from "winston";
import dotenv from "dotenv";

import { db } from "../../config/connect";
import { eq } from "drizzle-orm";
import { account_request } from "../../models/req_acc/account_request";
import jwt from "jsonwebtoken";
import { createMail } from "../../middleware/createMail";

dotenv.config();

type ApprovalData = {
  name: string;
  id: string;
  email: string;
  date: string | null;
  acc_req_id: string;
  status: "Pending" | "Approved" | "Rejected";
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
  type: string;
  signature: string | null;
  remark: string | null;
};
type UserRequestData = {
  user_name: string;
  user_email: string;
  user_date: Date | null;
};

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const sendMail = async (data: ApprovalData, cc: string, subject:string) => {
  // const { from, to, subject, cc } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    // requireTLS: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const token = jwt.sign(
    {
      id: data.acc_req_id,
      email: data.email,
    },
    "supersecret",
    { expiresIn: "24h" }
  );
  const ccMail = cc.split(",");
  const userRequestData: UserRequestData = await db
    .select({
      user_name: account_request.full_name,
      user_email: account_request.email,
      user_date: account_request.created_at,
    })
    .from(account_request)
    .where(eq(account_request.id, data.acc_req_id))
    .execute()
    .then((res) => res[0]);

  const message = await createMail(
    ccMail,
    subject,
    data,
    userRequestData,
    token
  );
  logger.info(`Sending mail to - ${data.email}`);

  transporter.sendMail(message, (error, info) => {
    if (error) {
      logger.error(`Error sending mail - ${error}`);
    } else {
      logger.info(`Email sent: ${info.response}`);
    }
  });
  return "Mail sent";
};
