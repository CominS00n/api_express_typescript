export const createApprovedTable = async (db: any) => {
  await db.execute(`
        CREATE TABLE approved (
        id SERIAL PRIMARY KEY,
        account_request_id SERIAL NOT NULL,
        head_of_requestor status DEFAULT 'Pending',
        head_of_requestor_remarks VARCHAR(100),
        head_of_requestor_date DATE,
        implementor status DEFAULT 'Pending',
        implementor_remarks VARCHAR(100),
        implementor_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );

        ALTER TABLE approved ADD CONSTRAINT fk_account_request_id FOREIGN KEY (account_request_id) REFERENCES account_request(id);
        `);
};

export const dropApprovedTable = async (db: any) => {
  await db.execute(`DROP TABLE IF EXISTS approved;`);
};
