'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product, ProductPicture } from '@/app/generated/prisma/client';

interface ProductWithPictures extends Product {
    pictures: ProductPicture[];
}

interface ProductCardProps {
    product: ProductWithPictures;
}

import { useCart } from './CartContext';

export function ProductCard({ product }: ProductCardProps) {
    const primaryImage = product.pictures[0]?.imageUrl || '/placeholder-image.jpg';
    const { addItem } = useCart();

    return (
        <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
            <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-secondary/20">
                    {product.pictures.length > 0 ? (
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>
            </Link>
            <CardContent className="p-4">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-10">
                    {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                        }).format(product.price)}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2 group-hover:bg-primary/90" onClick={() => addItem(product)}>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
