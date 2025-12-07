import { getProduct } from '../actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Edit, Package } from 'lucide-react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container">
            {/* Header */}
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 -ml-2">
                    <Link href="/admin/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Produk
                    </Link>
                </Button>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
                        {product.category && (
                            <Badge variant="secondary" className="text-sm">
                                <Package className="mr-1 h-3 w-3" />
                                {product.category.name}
                            </Badge>
                        )}
                    </div>
                    <Button asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Produk
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Images Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-lg border bg-card overflow-hidden">
                        {product.pictures && product.pictures.length > 0 ? (
                            <>
                                {/* Main Image */}
                                <div className="relative aspect-video bg-muted">
                                    {product.pictures[0].imageUrl ? (
                                        <Image
                                            src={product.pictures[0].imageUrl}
                                            width={500}
                                            height={500}
                                            alt={product.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                            <Package className="h-10 w-10 opacity-50" />
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Grid */}
                                {product.pictures.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2 p-4 bg-muted/30">
                                        {product.pictures.map((picture: any, index: number) => (
                                            <div
                                                key={picture.id}
                                                className="relative aspect-square border-2 border-transparent hover:border-primary rounded-md overflow-hidden cursor-pointer transition-all"
                                            >
                                                <img
                                                    src={picture.imageUrl ?? ''}
                                                    alt={`${product.name} - ${index + 1}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                    <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                    <p>Tidak ada gambar tersedia</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description Card */}
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="text-lg font-semibold mb-3">Deskripsi</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {product.description || 'Tidak ada deskripsi tersedia untuk produk ini.'}
                        </p>
                    </div>
                </div>

                {/* Product Info Sidebar */}
                <div className="space-y-4">
                    {/* Price Card */}
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="text-sm font-medium text-muted-foreground mb-2">Harga</h2>
                        <p className="text-3xl font-bold text-primary">
                            {formatCurrency(product.price)}
                        </p>
                    </div>

                    {/* Product Details Card */}
                    <div className="rounded-lg border bg-card p-6 space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Detail Produk</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between items-start py-2 border-b">
                                <span className="text-sm font-medium text-muted-foreground">ID Produk</span>
                                <span className="text-sm font-mono">{product.id}</span>
                            </div>

                            <div className="flex justify-between items-start py-2 border-b">
                                <span className="text-sm font-medium text-muted-foreground">Kategori</span>
                                <span className="text-sm font-medium">{product.category?.name || '-'}</span>
                            </div>

                            <div className="flex justify-between items-start py-2 border-b">
                                <span className="text-sm font-medium text-muted-foreground">Gambar</span>
                                <span className="text-sm font-medium">
                                    {product.pictures?.length || 0} foto
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}