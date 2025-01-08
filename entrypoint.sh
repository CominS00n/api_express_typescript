#!/bin/sh

if [ "$RUN_DB_SETUP" = "true" ]; then
  ./wait-for-it.sh postgres 5432 -- npm run db:generate && npm run db:migrate && npm run db:seed
fi

npm run start
