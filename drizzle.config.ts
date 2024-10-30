import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: "postgres://sitthichai:admin1234@localhost:5435/rct_account",
  },
  migrations: {
    table: '__drizzle_migrations', // `__drizzle_migrations` by default
    schema: 'drizzle', // used in PostgreSQL only, `drizzle` by default
  },

});
