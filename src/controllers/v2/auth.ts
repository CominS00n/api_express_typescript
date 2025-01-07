import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "../../config/connect";
import { users } from "../../models/users/users";
import { userViews } from "../../models/view_table/user_views";
// import logActivity from "../../middleware/createLog";

const ageCookie = 1000 * 60 * 60 * 5; // 5 hours

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const usersLogin = await db
      .select()
      .from(userViews)
      .where(eq(userViews.user_username, username))
      .execute();
    const result = usersLogin[0];

    const match = await bcrypt.compare(password, result.user_password);
    if (!match) {
      res
        .status(401)
        .json({ message: "Invalid user or password", status: 401 });
    } else {
      const roles = [...new Set(usersLogin.map((user) => user.role_name))];
      const permissions = usersLogin.map((user) => user.permission_name);
      const groups = [...new Set(usersLogin.map((user) => user.group_id))];

      const token = jwt.sign(
        {
          id: result.user_id,
        },
        "supersecret",
        { expiresIn: "5h" }
      );
      res.cookie("token", token, {
        maxAge: ageCookie,
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });

      // create json object
      const res_data = {
        id: result.user_id,
        name: result.user_name,
        roles: roles,
        permissions: permissions,
        groups: groups,
      };

      // create log
      // logActivity("LI", result.user_name, "User logged in", "User logged in");
      res
        .status(200)
        .json({ message: "Login successful", data: res_data, status: 200 });
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid user or password", status: 401 });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful", status: 200 });
  } catch (error) {
    res.status(401).json({ message: "Error logging out", status: 401 });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phone,
      position,
      company,
      division,
    } = req.body;
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const data = {
      username,
      password: hashedPassword,
      name,
      position,
      company,
      division,
      email,
      phone,
    };
    await db.insert(users).values(data).execute();

    // create log
    // logActivity("CR", name, "User created", "User created");
    res.status(201).json({ message: "User created", status: 201 });
  } catch (error) {
    res.status(500).json({ message: "User creation failed", status: 500 });
  }
};
