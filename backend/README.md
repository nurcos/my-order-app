docker compose up -d --build

docker compose exec myorder_backend npx prisma migrate deploy
docker compose exec myorder_backend npx ts-node prisma/seed.ts