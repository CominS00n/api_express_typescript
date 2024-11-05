import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../../config/connectDB";
import { users } from "../../models/users";
import logActivity, { LogActivity } from "../../middleware/createLog";

const ageCookie = 1000 * 60 * 60 * 5; // 5 hours

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();
    const result = user[0];

    const match = await bcrypt.compare(password, result.password);
    if (!match) {
      res.status(400).json({ message: "Invalid user or password", status: 400 });
    } else {
      const token = jwt.sign(
        { username: result.username, name: result.name },
        "supersecret",
        { expiresIn: "5h" }
      );
      let logData: LogActivity = {
        activityUser: result.name,
        activityDetails: "User logged in",
        activityDate: new Date().toISOString(),
      };
      await logActivity(logData);
      res.cookie("token", token, {
        maxAge: ageCookie,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      res.status(200).json({ message: "Login successful", status: 200 });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid user or password", status: 400 });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    let logData: LogActivity = {
      activityUser: req.cookies.user.name,
      activityDetails: "User logged out",
      activityDate: new Date().toISOString(),
    };
    await logActivity(logData);
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful", status: 200 });
  } catch (error) {
    res.status(400).json({ message: "Error logging out", status: 400 });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, name, email, role_id } = req.body;
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const data = {
      username,
      password: hashedPassword,
      name,
      email,
      role_id,
    };
    let logData: LogActivity = {
      activityUser: name,
      activityDetails: "User registered",
      activityDate: new Date().toISOString(),
    };
    await db.insert(users).values(data).execute();
    await logActivity(logData);
    res.status(201).json({ message: "User created", status: 201 });
  } catch (error) {
    res.status(500).json({ message: "User creation failed", status: 500 });
  }
};
