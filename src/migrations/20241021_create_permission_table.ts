export const createPermissionTable = async (db: any) => {
  await db.execute(`
    CREATE TABLE permission (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

export const dropPermissionTable = async (db: any) => {
  await db.execute(`DROP TABLE permission;`);
};
