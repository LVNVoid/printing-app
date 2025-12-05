import prisma from '@/lib/prisma';
import { ProductCard } from './ProductCard';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ProductSectionProps {
    categorySlug?: string;
    page?: number;
    search?: string;
}

import { unstable_cache } from 'next/cache';

const getCachedProducts = unstable_cache(
    async (page: number, categorySlug?: string, search?: string) => {
        const pageSize = 8;
        const skip = (page - 1) * pageSize;
        const where: any = {};

        if (categorySlug) {
            where.category = {
                slug: categorySlug
            };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        return Promise.all([
            prisma.product.findMany({
                take: pageSize,
                skip,
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    pictures: true,
                    category: true,
                },
            }),
            prisma.product.count({ where })
        ]);
    },
    ['products-list'],
    { revalidate: 3600, tags: ['products'] }
);

export async function ProductSection({ categorySlug, page = 1, search }: ProductSectionProps) {
    const pageSize = 8;

    const [productsData, categoryData] = await Promise.all([
        getCachedProducts(page, categorySlug, search),
        categorySlug ? prisma.category.findUnique({
            where: { slug: categorySlug },
            select: { name: true }
        }) : Promise.resolve(null)
    ]);

    const [products, totalCount] = productsData;
    const categoryName = categoryData?.name || 'All Products';
    const totalPages = Math.ceil(totalCount / pageSize);

    const createPageUrl = (newPage: number) => {
        const params = new URLSearchParams();
        if (categorySlug) params.set('category', categorySlug);
        if (search) params.set('search', search);
        params.set('page', newPage.toString());
        return `/products?${params.toString()}`;
    };

    return (
        <section className="bg-background">
            <div className="container">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {search ? `Search Results for "${search}"` : categoryName}
                        </h2>
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-3xl">
                        <p className="text-xl text-muted-foreground">No products found. Please check back later.</p>
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={createPageUrl(page - 1)}
                                        aria-disabled={page <= 1}
                                        size="default"
                                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <PaginationItem key={p}>
                                        <PaginationLink
                                            href={createPageUrl(p)}
                                            isActive={p === page}
                                            size="icon"
                                        >
                                            {p}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href={createPageUrl(page + 1)}
                                        aria-disabled={page >= totalPages}
                                        size="default"
                                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </section>
    );
}
