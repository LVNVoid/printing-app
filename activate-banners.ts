import 'dotenv/config';
import prisma from './lib/prisma';

async function main() {
  try {
    console.log('Activating all banners...');
    await prisma.banner.updateMany({
      data: { active: true },
    });
    console.log('All banners activated.');
    
    const activeBanners = await prisma.banner.findMany({
      where: { active: true },
    });
    console.log('Active banners:', activeBanners);
  } catch (error) {
    console.error('Error updating banners:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
