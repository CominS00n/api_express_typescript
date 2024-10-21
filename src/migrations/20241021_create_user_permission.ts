export const createUserPermissionTable = async (db: any) => {
  await db.execute(`
     CREATE TABLE user_permission (
     id SERIAL PRIMARY KEY,
     user_id INTEGER NOT NULL,
     permission_id INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (permission_id) REFERENCES permission(id)
     );
     
     ALTER TABLE user_permission
     ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);
     ALTER TABLE user_permission
     ADD CONSTRAINT fk_permission_id FOREIGN KEY (permission_id) REFERENCES permission(id);
    `);
};

export const dropUserPermissionTable = async (db: any) => {
  await db.execute(`DROP TABLE user_permission;`);
};
