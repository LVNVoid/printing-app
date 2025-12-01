import prisma from '@/lib/prisma';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CategoryList } from './CategoryList';

interface ProductSectionProps {
    categorySlug?: string;
}

export async function ProductSection({ categorySlug }: ProductSectionProps) {
    const products = await prisma.product.findMany({
        take: 8,
        where: categorySlug ? {
            category: {
                slug: categorySlug
            }
        } : undefined,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            pictures: true,
            category: true,
        },
    });

    return (
        <section className="bg-background">
            <div className="container">
                <div className="flex flex-col gap-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {categorySlug ? 'Filtered Products' : 'All Products'}
                        </h2>
                    </div>
                    <CategoryList activeCategory={categorySlug} />
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
            </div>
        </section>
    );
}
