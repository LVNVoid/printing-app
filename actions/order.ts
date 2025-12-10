'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createNotification } from '@/app/actions/notifications';

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
        user: true,
      },
    });

    // Notify Admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
    });

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        title: 'Pesanan Baru Masuk',
        message: `Pesanan baru #${order.id.slice(0, 8)} dari ${order.user.name}. Total: Rp ${total.toLocaleString('id-ID')}`,
        type: 'ORDER',
        link: `/admin/orders/${order.id}`,
      });
    }

    try {
      revalidatePath('/orders');
    } catch (error) {
      console.warn('Could not revalidate path:', error);
    }
    return { success: true, order };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Gagal membuat pesanan' };
  }
}

export async function getUserOrders(userId: string, statuses?: string[]) {
  try {
    const whereClause: any = {
      userId,
    };

    if (statuses && statuses.length > 0) {
      whereClause.status = {
        in: statuses,
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}
