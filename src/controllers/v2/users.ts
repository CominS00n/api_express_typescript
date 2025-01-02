import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { users } from "../../models/users/users";

import { userViews } from "../../models/view_table/user_views";

export const users_get_id = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const user = await db
      .select()
      .from(userViews)
      .where(eq(userViews.user_id, id))
      .execute();
    res.status(200).json({ message: "User found", data: user, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "User not found", status: 404 });
  }
};

export const users_post = async (req: Request, res: Response) => {
  try {
    await db.insert(users).values(req.body).execute();
    res.status(201).json({ message: "User created successfully", status: 201 });
  } catch (error) {
    res.status(500).json({ message: "User creation failed", status: 500 });
  }
};

export const users_delete = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await db.delete(users).where(eq(users.id, id)).execute();
    res.status(200).json({ message: "User deleted successfully", status: 200 });
  } catch (error) {
    res.status(404).json({ message: "User not found", status: 404 });
  }
};

export const users_get = async (req: Request, res: Response) => {
  try {
    const users = await db.select().from(userViews).execute();

    const result = users.reduce((acc: any[], row: any) => {
      let user = acc.find((r: any) => r.user_id === row.user_id);

      if (!user) {
        user = {
          user_id: row.user_id,
          user_name: row.user_name,
          user_email: row.user_email,
          user_username: row.user_username,
          user_password: row.user_password,
          roles: [],
          groups: [],
        };
        acc.push(user);
      }

      if (row.role_id) {
        let role = user.roles.find((r: any) => r.role_id === row.role_id);
        if (!role) {
          role = {
            role_id: row.role_id,
            role_name: row.role_name,
            permissions: [],
          };
          user.roles.push(role);
        }

        if (row.permission_name) {
          if (!role.permissions.includes(row.permission_name)) {
            role.permissions.push(row.permission_name);
          }
        }
      }

      if (row.group_name) {
        if (!user.groups.includes(row.group_name)) {
          user.groups.push(row.group_name);
        }
      }

      return acc;
    }, []);

    res.status(200).json({ message: "Users found", data: result, status: 200 });
  } catch (error) {
    console.error("Error fetching user views:", error);
    res
      .status(500)
      .json({ message: "Error fetching user views", error: error });
  }
};

export const get_users_by_group = async (req: Request, res: Response) => {
  try {
    const group: string = req.params.group;
    const users = await db
      .select()
      .from(userViews)
      .where(eq(userViews.group_id, group))
      .execute();

    const result = users.reduce((acc: any[], row: any) => {
      let user = acc.find((r: any) => r.user_id === row.user_id);

      if (!user) {
        user = {
          user_id: row.user_id,
          user_name: row.user_name,
          user_email: row.user_email,
          user_username: row.user_username,
          user_password: row.user_password,
          roles: [],
          groups: [],
        };
        acc.push(user);
      }

      if (row.role_id) {
        let role = user.roles.find((r: any) => r.role_id === row.role_id);
        if (!role) {
          role = {
            role_id: row.role_id,
            role_name: row.role_name,
            permissions: [],
          };
          user.roles.push(role);
        }

        if (row.permission_name) {
          if (!role.permissions.includes(row.permission_name)) {
            role.permissions.push(row.permission_name);
          }
        }
      }

      if (row.group_name) {
        if (!user.groups.includes(row.group_name)) {
          user.groups.push(row.group_name);
        }
      }

      return acc;
    }, []);

    res.status(200).json({ message: "Users found", data: result, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Users not found", status: 404 });
  }
};
