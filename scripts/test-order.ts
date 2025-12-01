import 'dotenv/config';
import { createOrder } from '../actions/order';
import prisma from '../lib/prisma';

async function main() {
  console.log('Starting order test...');

  // 1. Get a user
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
  });

  if (!user) {
    console.error('Test user not found. Please run seed script first.');
    return;
  }

  console.log('Found user:', user.id);

  // 2. Get a product (create one if none exist)
  let product = await prisma.product.findFirst();

  if (!product) {
    console.log('No products found, creating a test product...');
    const category = await prisma.category.findFirst();
    product = await prisma.product.create({
      data: {
        name: 'Test Product',
        slug: 'test-product',
        price: 1000,
        categoryId: category?.id ?? null,
      },
    });
  }

  console.log('Using product:', product.id);

  // 3. Create an order
  console.log('Creating order...');
  const result = await createOrder({
    userId: user.id,
    items: [
      {
        productId: product.id,
        quantity: 2,
      },
    ],
  });

  if (result.success && result.order) {
    console.log('Order created successfully!');
    console.log('Order ID:', result.order.id);
    console.log('Total:', result.order.total);
    console.log('Status:', result.order.status);
  } else {
    console.error('Failed to create order:', result.error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
