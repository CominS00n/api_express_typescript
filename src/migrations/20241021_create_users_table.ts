// import { Drizzle } from "drizzle-orm";

export const createUsersTable = async (db: any) => {
  await db.execute(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

export const dropUsersTable = async (db: any) => {
  await db.execute(`DROP TABLE users;`);
};
