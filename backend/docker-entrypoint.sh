#!/bin/sh
set -e

npx prisma generate
npx prisma migrate deploy
npm run seed
rm -rf dist
npm run start:dev
