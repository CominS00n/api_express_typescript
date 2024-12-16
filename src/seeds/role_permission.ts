import { db } from "../config/connect";
import { rolePermission } from "../models/role_permissions/role_permissions";

export const rolePermissionSeeds = async () => {
  await db
    .insert(rolePermission)
    .values([
      { role_id: '1', permission_id: '1' },
      { role_id: '2', permission_id: '2' },
      { role_id: '2', permission_id: '3' },
      { role_id: '2', permission_id: '4' },
      { role_id: '2', permission_id: '5' },
      { role_id: '2', permission_id: '6' },
      { role_id: '2', permission_id: '7' },
      { role_id: '2', permission_id: '11' },
      { role_id: '2', permission_id: '14' },
      { role_id: '2', permission_id: '15' },
      { role_id: '2', permission_id: '18' },
      { role_id: '2', permission_id: '19' },
      { role_id: '2', permission_id: '20' },
      { role_id: '2', permission_id: '21' },
      { role_id: '3', permission_id: '18' },
      { role_id: '3', permission_id: '19' },
      { role_id: '3', permission_id: '20' },
      { role_id: '3', permission_id: '21' },
    ])
    .execute();
};
