CREATE VIEW "public"."user_views" AS (
    select "users"."user_id", "users"."name", "users"."email", "role"."role_id", "role"."role_name", "permission"."perm_id", "permission"."perm_name", "group"."group_id", "group"."group_name"
    from
        "users"
        left join "user_role" on "users"."user_id" = "user_role"."user_id"
        left join "role" on "user_role"."role_id" = "role"."role_id"
        left join "role_permission" on "role"."role_id" = "role_permission"."role_id"
        left join "permission" on "role_permission"."permission_id" = "permission"."perm_id"
        left join "user_group" on "users"."user_id" = "user_group"."user_id"
        left join "group" on "user_group"."group_id" = "group"."group_id"
);