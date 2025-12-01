import { ProductForm } from '../../_components/product-form';
import { getProduct } from '../../actions';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <div className="rounded-md border bg-card p-6">
                <ProductForm product={product} />
            </div>
        </div>
    );
}
