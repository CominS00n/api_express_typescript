import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error: ", err);
  } else {
    console.log("Connected to the database");
  }
});

export const db = drizzle(pool);
