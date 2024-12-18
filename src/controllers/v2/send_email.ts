import { Request, Response } from "express";
import nodemailer from "nodemailer";
import winston from "winston";
import dotenv from "dotenv";

import { db } from "../../config/connect";
import jwt from "jsonwebtoken";

dotenv.config();

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const generateEmailMessage = (html: string) => {
  let message = ``;
  return message;
};

export const sendMail = async (req: Request, res: Response) => {
  const { from, to, subject, html, cc } = req.body;
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
  let message = {
    from: "Nodemailer <example@nodemailer.com>",
    to: "Nodemailer <example@nodemailer.com>",
    subject: "AMP4EMAIL message",
    text: "For clients with plaintext support only",
    html: "<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>",
    amp: `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
      </head>
      <body>
        <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
        <p>GIF (requires "amp-anim" script in header):<br/>
          <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
      </body>
    </html>`,
  };
};
