import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'template1',
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  ssl: false,
});

const createDb = async () => {
  try {
    await pool.query("CREATE DATABASE rct_account");
    console.log("Database created");
  } catch (error) {
    if ((error as any).code === "42P04") {
      console.log("Database already exists");
    } else {
      console.error("Error creating database:", error);
    }
  } finally {
    await pool.end();
  }
};

createDb();
