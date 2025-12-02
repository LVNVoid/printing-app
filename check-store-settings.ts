import prisma from './lib/prisma';

async function main() {
  try {
    console.log('Checking StoreSettings model...');
    if (prisma.storeSettings) {
        console.log('prisma.storeSettings exists');
        const settings = await prisma.storeSettings.findFirst();
        console.log('Settings:', settings);
    } else {
        console.error('prisma.storeSettings is UNDEFINED');
        console.log('Available models:', Object.keys(prisma).filter(key => !key.startsWith('_') && !key.startsWith('$')));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
