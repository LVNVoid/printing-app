'use server';

import prisma from "@/lib/prisma";


export async function getCustomers({
    query,
    page = 1,
    limit = 10
}: {
    query?: string;
    page?: number;
    limit?: number;
} = {}) {
    const where: any = {};
    
    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phoneNumber: { contains: query, mode: 'insensitive' } },
        ];
    }

    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
        prisma.user.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        }),
        prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return {
        users,
        totalPages,
        totalUsers,
    };
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
