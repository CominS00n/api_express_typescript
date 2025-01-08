import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/models/**/*.ts",
  out: "./src/migration",
  dbCredentials: {
    host: process.env.DB_HOST || "",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    ssl: false,
  },
  migrations: {
    table: "__drizzle_migrations", // `__drizzle_migrations` by default
    schema: "public", // used in PostgreSQL only, `public` by default
  },
});
