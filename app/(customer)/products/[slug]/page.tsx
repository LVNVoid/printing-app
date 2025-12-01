import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { AddToCartButton } from '@/components/customer/AddToCartButton';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { pictures: true },
    });

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const primaryImage = product.pictures[0]?.imageUrl;

    return {
        title: `${product.name} | Cloudinary Next`,
        description: product.description || `Buy ${product.name} at Cloudinary Next`,
        openGraph: {
            title: product.name,
            description: product.description || `Buy ${product.name} at Cloudinary Next`,
            images: primaryImage ? [{ url: primaryImage }] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
        where: { slug },
        include: { pictures: true, category: true },
    });

    if (!product) {
        notFound();
    }

    const primaryImage = product.pictures[0]?.imageUrl || '/placeholder-image.jpg';

    return (
        <div className="container py-10">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="relative aspect-square bg-secondary/20 rounded-xl overflow-hidden">
                    {product.pictures.length > 0 ? (
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        {product.category && (
                            <div className="text-sm text-muted-foreground mb-2">
                                {product.category.name}
                            </div>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                    </div>

                    <div className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                        }).format(product.price)}
                    </div>

                    <div className="prose max-w-none text-muted-foreground">
                        <p>{product.description}</p>
                    </div>

                    <div className="mt-auto pt-6">
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}
