'use server';

import prisma from '@/lib/prisma';

export async function getDashboardStats() {
  const [
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders
  ] = await Promise.all([
    // Total Revenue (Sum of paid/completed orders)
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ['PAID', 'SHIPPED', 'COMPLETED'],
        },
      },
    }),

    // Total Orders
    prisma.order.count(),

    // Total Products
    prisma.product.count(),

    // Total Customers
    prisma.user.count({
      where: {
        role: 'CUSTOMER',
      },
    }),

    // Recent Orders
    prisma.order.findMany({
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
  };
}
