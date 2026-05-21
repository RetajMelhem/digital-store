#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy
fi

echo "Starting Next.js server..."
exec npm run start
