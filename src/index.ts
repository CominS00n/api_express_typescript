import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";

// import route from "./route";
import route from "./routes/index";

dotenv.config();

const app: Express = express();
const port: number = 8000;

//! Send email
// import {sendMail} from './middleware/sendEmail';
// try {
//   const from: string = 'spuckpoo@gmail.com';
//   const to: string = 'spuckpoocominsoon@gmail.com';
//   const subject: string = 'test send email';
//   const mailTemplate: string = '<h1>Test send email</h1> <a href="https://www.google.com">Google</a>';
//   const cc: string = '';
//   sendMail( from, to, subject, mailTemplate, cc);
// } catch (error) {
//   console.error(error);
// }

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://rtc-template-frontend.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api/v2", route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
