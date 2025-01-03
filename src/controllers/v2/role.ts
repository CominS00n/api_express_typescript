import { Request, Response } from "express";

import { db } from "../../config/connect";
import { eq } from "drizzle-orm";
import { role } from "../../models/role_permissions/roles";
import { rolePermission } from "../../models/role_permissions/role_permissions";

export const role_get = async (req: Request, res: Response) => {
  try {
    const roles = await db.select().from(role).execute();
    res.status(200).json({ message: "Role found", data: roles, status: 200 });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({ message: "Error getting role", status: 500 });
  }
};

export const role_post = async (req: Request, res: Response) => {
  type Role = {
    name: string;
    description: string;
  };
  try {
    const { name, description, permissions } = req.body;
    const roleData: Role = { name: name, description: description };
    const createRole = await db
      .insert(role)
      .values(roleData)
      .returning()
      .execute();
    const roleId = createRole[0].id;
    const rolePermissionData = permissions.map((permissionId: number) => ({
      role_id: roleId,
      permission_id: permissionId,
    }));

    await db.insert(rolePermission).values(rolePermissionData).execute();
    res
      .status(200)
      .json({ message: "Role created", data: createRole, status: 200 });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role", status: 500 });
  }
};
export const role_delete = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db
      .delete(rolePermission)
      .where(eq(rolePermission.role_id, id))
      .execute();

    await db.delete(role).where(eq(role.id, id)).execute();
    res.status(200).json({ message: "Role deleted", status: 200 });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role", status: 500 });
  }
};

export const role_put = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;
    const roleData = { name, description };
    await db.update(role).set(roleData).where(eq(role.id, id)).execute();
    await db
      .delete(rolePermission)
      .where(eq(rolePermission.role_id, id))
      .execute();
    const rolePermissionData = permissions.map((permissionId: string) => ({
      role_id: id,
      permission_id: permissionId,
    }));
    await db.insert(rolePermission).values(rolePermissionData).execute();
    res.status(200).json({ message: "Role updated", status: 200 });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role", status: 500 });
  }
};

export const role_get_id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleData = await db
      .select()
      .from(role)
      .where(eq(role.id, id))
      .execute();
    res.status(200).json({ message: "Role found", data: roleData, status: 200 });
  } catch (error) {
    console.error("Error getting role:", error);
    res.status(500).json({ message: "Error getting role", status: 500 });
  }
};
