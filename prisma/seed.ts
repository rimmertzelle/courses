import { PrismaClient } from '../prisma/generated/prisma/client.ts';
import { seedClients } from '../src/modules/clients/seed.js';
import { seedCourses } from '../src/modules/courses/seed.js';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const [clientsCount, coursesCount] = await Promise.all([
    seedClients(prisma),
    seedCourses(prisma),
  ]);
  console.log(`Seeded ${clientsCount} clients`);
  console.log(`Seeded ${coursesCount} courses`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
