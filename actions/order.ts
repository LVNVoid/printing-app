'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CreateOrderParams {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export async function createOrder({ userId, items }: CreateOrderParams) {
  try {
    // 1. Aggregate items by productId
    const aggregatedItems = new Map<string, number>();
    for (const item of items) {
      const currentQuantity = aggregatedItems.get(item.productId) || 0;
      aggregatedItems.set(item.productId, currentQuantity + item.quantity);
    }

    // 2. Calculate total and verify products exist
    let total = 0;
    const orderItemsData = [];

    for (const [productId, quantity] of aggregatedItems.entries()) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error(`Produk dengan ID ${productId} tidak ditemukan`);
      }

      total += product.price * quantity;
      orderItemsData.push({
        productId: productId,
        quantity: quantity,
        price: product.price,
      });
    }

    // 3. Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    try {
      revalidatePath('/orders');
    } catch (error) {
      // Ignore revalidatePath error in standalone scripts
      console.warn('Could not revalidate path:', error);
    }
    return { success: true, order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Gagal membuat pesanan' };
  }
}
