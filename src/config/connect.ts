import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

let pool = new Pool();
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  console.log("Connected to the database");
} catch (error) {
  console.error("Failed to connect to the database:", error);
}

// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("Error: ", err);
//   } else {
//     console.log("Connected to the database");
//   }
// });

export const db = drizzle(pool);
