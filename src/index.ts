import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import route from "./routes/index";

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT) || 8000;

app.use(express.json());
app.use(cookieParser());
const corsOrigin = process.env.CORS_ORIGIN?.split(",") || ["http://localhost:82"];
app.use(cors({
    origin: corsOrigin,
    credentials: true,
}));

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
