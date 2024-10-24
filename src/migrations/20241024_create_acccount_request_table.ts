export const createAccountRequestTable = async (db: any) => {
  await db.execute(`
        CREATE TABLE account_request (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        company VARCHAR(100) NOT NULL,
        division VARCHAR(100) NOT NULL,
        telephone VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        req_type req_type NOT NULL,
        system VARCHAR(100) NOT NULL,
        req_date DATE NOT NULL,
        account_type account_type NOT NULL,
        expiry_date DATE,
        service_type TEXT [] NOT NULL,
        user_type TEXT [] NOT NULL,
        status status DEFAULT 'Pending' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
    };

export const dropAccountRequestTable = async (db: any) => {
  await db.execute(`DROP TABLE IF EXISTS account_request;`);
};
