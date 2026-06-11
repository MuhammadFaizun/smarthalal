import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [total, halal, syubhat, haram] = await Promise.all([
    prisma.ingredient.count(),
    prisma.ingredient.count({ where: { status: 'HALAL' } }),
    prisma.ingredient.count({ where: { status: 'SYUBHAT' } }),
    prisma.ingredient.count({ where: { status: 'HARAM' } }),
  ]);

  const totalCount = total || 1;
  console.log('STATS_RESULT:', {
    total,
    halal: Math.round((halal / totalCount) * 100),
    syubhat: Math.round((syubhat / totalCount) * 100),
    haram: Math.round((haram / totalCount) * 100),
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
