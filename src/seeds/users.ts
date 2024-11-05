import { db } from "../config/connectDB";
import { users } from "../models/users";

import bcrypt from "bcrypt";

export const usersSeeds = async () => {
  const username: string = "admin";
  const password: string = "admin";
  const name: string = "sitthihai puckpoo";
  const email: string = "spuckpoo@gmail.com";
  const hashedPassword: string = await bcrypt.hash(password, 10);

  await db
    .insert(users)
    .values({
      username: username,
      password: hashedPassword,
      name: name,
      email: email,
      role_id: 1,
    })
    .execute();
};
