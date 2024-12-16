import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import route from "./routes/index";

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT) || 8000;
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
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

app.use("/api/v2", route);

const httpsOptions = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

https.createServer(httpsOptions, app).listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
