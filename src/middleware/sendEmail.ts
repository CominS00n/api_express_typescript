import nodemailer from "nodemailer";
import winston from "winston";
import dotenv from "dotenv";

import type { em } from "../types";
import jwt from "jsonwebtoken";

dotenv.config();

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export const sendMail = async (
  from: string,
  to: string,
  subject: string,
  html: em,
  cc: string
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const token = jwt.sign({
    id: html.em_id,
    email: to,
  }, "supersecret", { expiresIn: "24h" });

  console.log(token);

  const message: string = `
  <div class="container">
    <h2>ยืนยันการสร้างบัญชีของคุณ</h2>
    <p>เรียนคุณ ${html.em_name},</p>
    <a href="http://localhost:3000/approval/${token}">Approved or Reject Account</a>
    <p>กรุณาดำเนินการยืนยันภายใน 24 ชั่วโมง มิฉะนั้นคำขอจะถูกยกเลิกโดยอัตโนมัติ</p>
    <div class="footer">
        <p>ขอแสดงความนับถือ,</p>
        <p>NT National Telecom</p>
        <p>[อีเมลติดต่อ] | [เบอร์โทรติดต่อ (ถ้ามี)]</p>
    </div>
</div>
`;

  const mailOptions = {
    from: from,
    to: to,
    subject: subject + " - " + new Date().toLocaleString(),
    html: message,
    cc: cc,
  };

  logger.info(`Sending mail to - ${to}`);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      logger.error(error);
    } else {
      logger.info("Email sent: " + info.response);
    }
  });
};
