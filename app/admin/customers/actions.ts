'use server';

import prisma from "@/lib/prisma";


export async function getCustomers() {
    const customers = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            _count: {
                select: { orders: true },
            },
        },
    });
    return customers;
}

export async function getCustomer(id: string) {
    const customer = await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
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
            },
        },
    });
    return customer;
}
