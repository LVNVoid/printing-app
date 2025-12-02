import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  try {
    console.log('Checking banners...');
    const allBanners = await prisma.banner.findMany();
    console.log('All banners:', allBanners);

    const activeBanners = await prisma.banner.findMany({
      where: { active: true },
    });
    console.log('Active banners:', activeBanners);
  } catch (error) {
    console.error('Error fetching banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
