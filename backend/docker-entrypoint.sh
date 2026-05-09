#!/bin/sh
set -e

npx prisma generate
npx prisma migrate deploy
npm run seed
npm run start:dev
