#!/bin/sh

# รอให้ PostgreSQL พร้อมใช้งาน
dockerize -wait tcp://localhost:5432 -timeout 60s

# เช็คว่าฐานข้อมูล rct_account มีอยู่หรือไม่
DB_EXISTS=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | tr -d '[:space:]')

if [ "$DB_EXISTS" = "1" ]; then
    echo "Database $DB_NAME exists. Checking for tables and data..."

    # เช็คว่ามีตารางและข้อมูลในฐานข้อมูลหรือไม่
    TABLE_EXISTS=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -tc "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users'" | tr -d '[:space:]')
    DATA_EXISTS=$(PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -tc "SELECT COUNT(*) FROM users" | tr -d '[:space:]')

    if [ "$TABLE_EXISTS" = "1" ] && [ "$DATA_EXISTS" -gt "0" ]; then
        echo "Table and data exist. Starting application..."
        npm run start
    else
        echo "Table or data do not exist. Running migrations and seed..."
        npm run db:generate && npm run db:migrate && npm run db:seed && npm run start
    fi
else
    echo "Database $DB_NAME does not exist. Running migrations and seed..."
    npm run db:generate && npm run db:migrate && npm run db:seed && npm run start
fi
fi