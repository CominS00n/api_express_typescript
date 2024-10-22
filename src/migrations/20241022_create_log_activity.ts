

export const createLogActivityTable = async (db: any) => {
    await db.execute(`
        CREATE TABLE log_activity (
        id SERIAL PRIMARY KEY,
        activity_user VARCHAR(100) NOT NULL,
        activity_details VARCHAR(100) NOT NULL,
        activity_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
    `);
};

export const dropLogActivityTable = async (db: any) => {
    await db.execute(`DROP TABLE IF EXISTS log_activity;`);
};