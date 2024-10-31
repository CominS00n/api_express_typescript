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

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
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

app.use("/api/v1", route);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
