import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

// import users from "./api/users";
// import permissions from "./api/permission";
import { v1 } from "./api/v1/route";

dotenv.config();

const app: Express = express();
const port: number = 8000;

app.use(cors());
app.use(express.json());
app.use("/api/", v1);

// app.use("/api", users);
// app.use("/api", permissions);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
