import { eq } from "drizzle-orm";
import { pgView } from "drizzle-orm/pg-core";
import { users } from "../users/users";
import { userRole } from "../users/user_roles";
import { role } from "../role_permissions/roles";
import { rolePermission } from "../role_permissions/role_permissions";
import { permission } from "../role_permissions/permissions";
import { userGroup } from "../users/user_groups";
import { group } from "../users/group";

export const userViews = pgView("user_views").as((qb) =>
  qb
    .select({
        user_id: users.id,
        user_name: users.name,
        user_email: users.email,
        role_id: role.id,
        role_name: role.name,
        permission_id: permission.id,
        permission_name: permission.name,
        group_id: group.id,
        group_name: group.name,
    })
    .from(users)
    .leftJoin(userRole, eq(users.id, userRole.user_id))
    .leftJoin(role, eq(userRole.role_id, role.id))
    .leftJoin(rolePermission, eq(role.id, rolePermission.role_id))
    .leftJoin(permission, eq(rolePermission.permission_id, permission.id))
    .leftJoin(userGroup, eq(users.id, userGroup.user_id))
    .leftJoin(group, eq(userGroup.group_id, group.id))
);
