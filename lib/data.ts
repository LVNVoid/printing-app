import { unstable_cache } from 'next/cache';
import prisma from '@/lib/prisma';

export const getCachedCategory = unstable_cache(
    async (slug: string) => {
        return prisma.category.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
            }
        });
    },
    ['category-detail'],
    { revalidate: 3600, tags: ['categories'] }
);

export const getCachedStoreSettings = unstable_cache(
    async () => {
        return prisma.storeSettings.findFirst({
            select: { storeName: true }
        });
    },
    ['store-settings'],
    { revalidate: 3600, tags: ['settings'] }
);
