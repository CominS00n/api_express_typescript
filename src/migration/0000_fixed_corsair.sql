CREATE TYPE "public"."account_type" AS ENUM('Permanent', 'Temporary');--> statement-breakpoint
CREATE TYPE "public"."req_type" AS ENUM('New Account', 'Terminate', 'Reset Password', 'Change');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('Pending', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_activity" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"activity_user" varchar(100) NOT NULL,
	"activity_details" varchar(100) NOT NULL,
	"activity_date" date NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account_request" (
	"acc_req_id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"position" varchar(100) NOT NULL,
	"company" varchar(100) NOT NULL,
	"division" varchar(100) NOT NULL,
	"telephone" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"req_type" "req_type" NOT NULL,
	"system" varchar(100) NOT NULL,
	"req_date" date NOT NULL,
	"account_type" "account_type" NOT NULL,
	"expiry_date" date,
	"service_type" text[] NOT NULL,
	"user_type" text[] NOT NULL,
	"status" "status" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "approved" (
	"approve_id" serial PRIMARY KEY NOT NULL,
	"acc_req_id" integer NOT NULL,
	"approved_type" varchar(50) NOT NULL,
	"approved_name" varchar(100) NOT NULL,
	"approved_email" varchar(150) NOT NULL,
	"approved_remark" text,
	"approved_status" "status" DEFAULT 'Pending' NOT NULL,
	"approved_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission" (
	"perm_id" serial PRIMARY KEY NOT NULL,
	"perm_name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_permission" (
	"role_id" integer NOT NULL,
	"permission_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role_name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"group_id" serial PRIMARY KEY NOT NULL,
	"group_name" varchar(100),
	"description" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "group_group_name_unique" UNIQUE("group_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_group" (
	"user_id" integer NOT NULL,
	"group_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_role" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone" varchar(11) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "approved" ADD CONSTRAINT "approved_acc_req_id_account_request_acc_req_id_fk" FOREIGN KEY ("acc_req_id") REFERENCES "public"."account_request"("acc_req_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_role_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_permission_perm_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("perm_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_group" ADD CONSTRAINT "user_group_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_group" ADD CONSTRAINT "user_group_group_id_group_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("group_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_role_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE VIEW "public"."user_views" AS (select "users"."user_id", "users"."name", "users"."email", "users"."username", "users"."password", "role"."role_id", "role"."role_name", "permission"."perm_id", "permission"."perm_name", "group"."group_id", "group"."group_name" from "users" left join "user_role" on "users"."user_id" = "user_role"."user_id" left join "role" on "user_role"."role_id" = "role"."role_id" left join "role_permission" on "role"."role_id" = "role_permission"."role_id" left join "permission" on "role_permission"."permission_id" = "permission"."perm_id" left join "user_group" on "users"."user_id" = "user_group"."user_id" left join "group" on "user_group"."group_id" = "group"."group_id");