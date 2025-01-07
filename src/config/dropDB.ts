import { Pool } from "pg";

import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'template1', // Connect to the default 'postgres' database
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

const dropDb = async () => {
  try {
    // Terminate all connections to the database
    await pool.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'rct_account'
      AND pid <> pg_backend_pid();
    `);

    // Drop the database
    await pool.query("DROP DATABASE IF EXISTS rct_account");
    console.log("Database dropped");
  } catch (error) {
    console.error("Error dropping database:", error);
  } finally {
    await pool.end();
  }
};

dropDb();
