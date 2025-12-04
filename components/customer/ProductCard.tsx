'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, ProductPicture } from '@/app/generated/prisma/client';
import { useState } from 'react';
import { useCart } from './CartContext';

interface ProductWithPictures extends Product {
    pictures: ProductPicture[];
}

interface ProductCardProps {
    product: ProductWithPictures;
}

export function ProductCard({ product }: ProductCardProps) {
    const primaryImage = product.pictures[0]?.imageUrl || '/placeholder-image.jpg';
    const { addItem } = useCart();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        await addItem(product);
        setTimeout(() => setIsAdding(false), 600);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="group relative h-full overflow-hidden rounded-lg border bg-card shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500">

            {/* IMAGE */}
            <Link href={`/products/${product.slug}`} className="block">
                <div className="relative w-full overflow-hidden bg-muted rounded-t-lg aspect-square m-0 p-0">
                    {product.pictures.length > 0 ? (
                        <>
                            <Image
                                src={primaryImage}
                                alt={product.name}
                                fill
                                className={`object-cover transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                    } group-hover:scale-105`}
                                sizes="100vw"
                                onLoad={() => setImageLoaded(true)}
                            />

                            {!imageLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Eye className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                    )}
                </div>
            </Link>

            {/* CONTENT */}
            <div className="p-4 space-y-3">
                <h3 className="font-semibold text-base text-foreground line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="flex items-center justify-between pt-2 gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-0.5">Price</p>
                        <p className="text-lg font-bold text-foreground">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    <Button
                        size="sm"
                        className="h-10 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                        onClick={handleAddToCart}
                    >
                        {isAdding ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        ) : (
                            <ShoppingCart className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
