import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/models/*",
  out: "./src/migration",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  // migrations: {
  //   table: "__drizzle_migrations", // `__drizzle_migrations` by default
  //   schema: "drizzle", // used in PostgreSQL only, `drizzle` by default
  // },
});
