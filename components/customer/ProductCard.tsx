'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, ProductPicture } from '@/app/generated/prisma/client';
import { useState } from 'react';

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
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        await addItem(product);
        setTimeout(() => setIsAdding(false), 600);
    };

    // Format harga yang lebih clean
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Card className="group h-full flex flex-col overflow-hidden border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
            {/* Image Container */}
            <Link href={`/products/${product.slug}`} className="relative block">
                <div className="relative aspect-square overflow-hidden bg-secondary/10">
                    {product.pictures.length > 0 ? (
                        <>
                            <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                onLoad={() => setImageLoaded(true)}
                            />
                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <Eye className="mx-auto h-12 w-12 opacity-20" />
                                <p className="mt-2 text-sm">No Image</p>
                            </div>
                        </div>
                    )}

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        >
                            <Eye className="h-4 w-4" />
                            Quick View
                        </Button>
                    </div>


                </div>
            </Link>

            {/* Content */}
            <CardContent className="flex-1 flex flex-col p-4 sm:p-5">
                <Link href={`/products/${product.slug}`} className="group/title">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-2 min-h-[3rem] group-hover/title:text-primary transition-colors leading-tight">
                        {product.name}
                    </h3>
                </Link>

                {product.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}

                {/* Price Section */}
                <div className="mt-auto pt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                            {formatPrice(product.price)}
                        </span>
                    </div>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4 sm:p-5 pt-0">
                <Button
                    className="w-full gap-2 h-10 sm:h-11 font-medium shadow-sm group-hover:shadow-md transition-all"
                    onClick={handleAddToCart}
                >
                    {isAdding ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
                            Add to Cart
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}