import bcrypt from "bcryptjs";

import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/connect";
import { users } from "../../models/users/users";

import { userViews } from "../../models/view_table/user_views";
import { userGroup } from "../../models/users/user_groups";
import { userRole } from "../../models/users/user_roles";

export const users_get_id = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const users = await db
      .select()
      .from(userViews)
      .where(eq(userViews.user_id, id))
      .execute();

    const result = users.reduce((acc: any[], row: any) => {
      let user = acc.find((r: any) => r.user_id === row.user_id);

      if (!user) {
        user = {
          user_id: row.user_id,
          user_name: row.user_name,
          user_email: row.user_email,
          user_company: row.user_company,
          user_division: row.user_division,
          user_position: row.user_position,
          user_phone: row.user_phone,
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

      if (row.group_id) {
        let group = user.groups.find((r: any) => r.group_id === row.group_id);
        if (!group) {
          group = {
            group_id: row.group_id,
            group_name: row.group_name,
          };
          user.groups.push(group);
        }
      }
      return acc;
    }, []);
    res.status(200).json({ message: "User found", data: result, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "User not found", status: 404 });
  }
};

export const users_delete = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    await db.delete(userRole).where(eq(userRole.user_id, id)).execute();
    await db.delete(userGroup).where(eq(userGroup.user_id, id)).execute();
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
          user_position: row.user_position,
          user_phone: row.user_phone,
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

      if (row.group_id) {
        let group = user.groups.find((r: any) => r.group_id === row.group_id);
        if (!group) {
          group = {
            group_id: row.group_id,
            group_name: row.group_name,
          };
          user.groups.push(group);
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
    console.log(group);
    const users = await db
      .select()
      .from(userViews)
      .where(eq(userViews.group_name, group))
      .execute();

    const result = users.reduce((acc: any[], row: any) => {
      let user = acc.find((r: any) => r.user_id === row.user_id);

      if (!user) {
        user = {
          user_id: row.user_id,
          user_name: row.user_name,
          user_email: row.user_email,
          user_position: row.user_position,
          user_phone: row.user_phone,
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

      if (row.group_id) {
        let group = user.groups.find((r: any) => r.group_id === row.group_id);
        if (!group) {
          group = {
            group_id: row.group_id,
            group_name: row.group_name,
          };
          user.groups.push(group);
        }
      }

      return acc;
    }, []);

    res.status(200).json({ message: "Users found", data: result, status: 200 });
  } catch (error) {
    res.status(404).json({ message: "Users not found", status: 404 });
  }
};

export const users_post = async (req: Request, res: Response) => {
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
      role_id,
      group_id,
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
    const res_user = await db.insert(users).values(data).returning().execute();
    const user_id = res_user[0].id;

    const user_role_data = role_id.map((role: string) => ({
      user_id,
      role_id: role,
    }));
    await db.insert(userRole).values(user_role_data).execute();

    const user_group_data = group_id.map((group: string) => ({
      user_id,
      group_id: group,
    }));
    await db.insert(userGroup).values(user_group_data).execute();

    res.status(201).json({ message: "User created", status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "User creation failed", status: 500 });
  }
};

export const users_put = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const {
      username,
      password,
      name,
      email,
      phone,
      position,
      company,
      division,
      role_id,
      group_id,
    } = req.body;
    // check if password is provided
    const oldPassword = await db
      .select({
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, id))
      .execute();

    let hashedPassword: string;
    if (password === oldPassword[0].password) {
      hashedPassword = password;
    } else {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const data = {
      username,
      password: hashedPassword,
      name,
      position,
      company,
      division,
      email,
      phone,
      updated_at: new Date(),
    };
    await db.update(users).set(data).where(eq(users.id, id)).execute();
    const user_role_data = role_id.map((role: string) => ({
      user_id: id,
      role_id: role,
    }));
    await db.delete(userRole).where(eq(userRole.user_id, id)).execute();
    await db.insert(userRole).values(user_role_data).execute();

    const user_group_data = group_id.map((group: string) => ({
      user_id: id,
      group_id: group,
    }));
    await db.delete(userGroup).where(eq(userGroup.user_id, id)).execute();
    await db.insert(userGroup).values(user_group_data).execute();

    res.status(200).json({ message: "User updated", status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "User update failed", status: 500 });
  }
};
