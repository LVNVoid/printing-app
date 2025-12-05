import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { AddToCartButton } from '@/components/customer/AddToCartButton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            pictures: true,
            category: true
        },
    });

    if (!product) {
        return {
            title: 'Produk Tidak Ditemukan',
            description: 'Produk yang Anda cari tidak tersedia di Foman Percetakan',
        };
    }

    const primaryImage = product.pictures[0]?.imageUrl || '/placeholder-image.jpg';
    const productUrl = `https://foman.co.id/products/${slug}`;

    const priceValue = product.price.toString();

    const seoDescription = product.description
        ? `${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}`
        : `Pesan ${product.name} berkualitas tinggi dari Foman Percetakan. Harga ${formatCurrency(product.price)}. Layanan profesional dan hasil memuaskan.`;

    const keywords = [
        product.name,
        `cetak ${product.name}`,
        `jasa ${product.name}`,
        product.category?.name || 'percetakan',
        'Foman',
        'percetakan',
        'printing',
        'cetak online',
        'cetak murah',
        'cetak berkualitas'
    ];

    return {
        title: `${product.name} - ${formatCurrency(product.price)}`,
        description: seoDescription,
        keywords: keywords,

        openGraph: {
            title: `${product.name} | Foman Percetakan`,
            description: seoDescription,
            url: productUrl,
            siteName: 'Foman Percetakan',
            locale: 'id_ID',
            type: 'website',
            images: [
                {
                    url: primaryImage,
                    width: 1200,
                    height: 1200,
                    alt: product.name,
                },
                ...(product.pictures
                    .slice(1, 4)
                    .filter((pic) => pic.imageUrl)
                    .map((pic) => ({
                        url: pic.imageUrl!,
                        width: 800,
                        height: 800,
                        alt: `${product.name} - Gambar tambahan`,
                    }))),
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: `${product.name} - ${formatCurrency(product.price)}`,
            description: seoDescription,
            images: [primaryImage],
            creator: '@fomanpercetakan',
        },

        alternates: {
            canonical: productUrl,
        },

        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },

        category: product.category?.name || 'Percetakan',

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
        <div className="container space-y-5 py-10">
            <div>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {product.category && (
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={`/products/?category=${product.category.slug}`}>
                                            {product.category.name}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        )}
                        <BreadcrumbItem>
                            <BreadcrumbPage>{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
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
                        {formatCurrency(product.price)}
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
