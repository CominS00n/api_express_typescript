import { db } from "../../config/connectDB";
import { users } from "../../schema/users";
import express, { Request, Response } from "express";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const route = express.Router();

route.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex")
      .toString();

    const userFound = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
      .execute();
    if (userFound.length !== 0) {
      if (userFound[0].password === hashedPassword) {
        res.json({ message: "Logged in", status: 200 });
      } else {
        res
          .status(401)
          .json({ error: "login fail username or password not valid" });
      }
    } else {
      res
        .status(401)
        .json({ error: "login fail username or password not valid" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in", message: error });
  }
});

route.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, name, email } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex")
      .toString();
    const data = {
      username,
      password: hashedPassword,
      name,
      email,
    };
    await db.insert(users).values(data).execute();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user", message: error });
  }
});

export default route;
