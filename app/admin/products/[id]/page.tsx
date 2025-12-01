import { getProduct } from '../actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Product Details</h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Back to List</Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-card p-6 space-y-4">
                <div>
                    <h3 className="font-medium text-muted-foreground">Name</h3>
                    <p className="text-lg">{product.name}</p>
                </div>
                <div>
                    <h3 className="font-medium text-muted-foreground">Category</h3>
                    <p className="text-lg">{product.category?.name || '-'}</p>
                </div>
                <div>
                    <h3 className="font-medium text-muted-foreground">Price</h3>
                    <p className="text-lg">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                    </p>
                </div>
                <div>
                    <h3 className="font-medium text-muted-foreground">Description</h3>
                    <p className="text-lg">{product.description || '-'}</p>
                </div>
                <div>
                    <h3 className="font-medium text-muted-foreground mb-2">Images</h3>
                    {product.pictures && product.pictures.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {product.pictures.map((picture: any) => (
                                <div key={picture.id} className="relative aspect-square border rounded overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={picture.imageUrl}
                                        alt={`Product image`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No images available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
