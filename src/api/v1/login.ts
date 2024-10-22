import express, { Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../../config/connectDB";
import { users } from "../../schema/users";
import logActivity, { LogActivity } from "../../middleware/createLog";

const route = express.Router();

route.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();
    const result = user[0];

    console.log("result", result);

    const match = await bcrypt.compare(password, result.password);
    console.log("match", match);
    if (!match) {
      res.status(400).json({ error: "Invalid user or password" });
    } else {
      const token = jwt.sign(
        { username: result.username, name: result.name },
        "supersecret",
        { expiresIn: "1h" }
      );
      let logData: LogActivity = {
        activityUser: result.name,
        activityDetails: "User logged in",
        activityDate: new Date().toISOString(),
      };
      await logActivity(logData);
      res.cookie("token", token, {
        maxAge: 60 * 60 * 60, // 1 hour
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(400).json({ error: "Invalid user or password" });
  }
});

route.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, name, email } = req.body;
    const hashedPassword: string = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword);
    const data = {
      username,
      password: hashedPassword,
      name,
      email,
    };
    let logData: LogActivity = {
      activityUser: name,
      activityDetails: "User registered",
      activityDate: new Date().toISOString(),
    };
    await db.insert(users).values(data).execute();
    await logActivity(logData);
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user", message: error });
  }
});

export default route;
