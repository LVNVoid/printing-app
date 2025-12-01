const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.order.count();
  console.log(`Total orders: ${count}`);
  if (count > 0) {
    const order = await prisma.order.findFirst();
    console.log('First order ID:', order.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
