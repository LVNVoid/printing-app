import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CategoryListProps {
    activeCategory?: string;
}

export async function CategoryList({ activeCategory }: CategoryListProps) {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/products">
                <Button
                    variant={!activeCategory ? "secondary" : "outline"}
                    size="sm"
                    className="rounded-full"
                >
                    All
                </Button>
            </Link>
            {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.slug}`}>
                    <Button
                        variant={activeCategory === category.slug ? "secondary" : "outline"}
                        size="sm"
                        className="rounded-full"
                    >
                        {category.name}
                    </Button>
                </Link>
            ))}
        </div>
    );
}
