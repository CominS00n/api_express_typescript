DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'req_type') THEN
        CREATE TYPE "req_type" AS ENUM ('New Account', 'Terminate', 'Reset Password', 'Change');
    END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN
		CREATE TYPE "status" AS ENUM ('Pending', 'Approved', 'Rejected');
	END IF;
END $$;

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
		CREATE TYPE "account_type" AS ENUM ('Permanent', 'Temporary');
	END IF;
END $$;

CREATE TABLE IF NOT EXISTS "account_request" (
    "id" serial PRIMARY KEY NOT NULL,
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
    "service_type" text [] NOT NULL,
    "user_type" text [] NOT NULL,
    "status" "status" DEFAULT 'Pending' NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "approved" (
    "id" serial PRIMARY KEY NOT NULL,
    "account_request_id" serial NOT NULL,
    "head_of_requestor" "status" DEFAULT 'Pending',
    "head_of_requestor_remarks" varchar(100),
    "head_of_requestor_date" date,
    "implementor" "status" DEFAULT 'Pending',
    "implementor_remarks" varchar(100),
    "implementor_date" date,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "log_activity" (
    "id" serial PRIMARY KEY NOT NULL,
    "activity_user" varchar(100) NOT NULL,
    "activity_details" varchar(100) NOT NULL,
    "activity_date" date NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar(100) NOT NULL,
    "description" varchar(100),
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_permission" (
    "id" serial PRIMARY KEY NOT NULL,
    "user_id" serial NOT NULL,
    "permission_id" serial NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "username" varchar(100) NOT NULL,
    "password" varchar(100) NOT NULL,
    "name" varchar(100) NOT NULL,
    "email" varchar(100) NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "updated_at" timestamp DEFAULT now()
);

DO $$ BEGIN
 ALTER TABLE "approved" ADD CONSTRAINT "approved_account_request_id_account_request_id_fk" FOREIGN KEY ("account_request_id") REFERENCES "public"."account_request"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;