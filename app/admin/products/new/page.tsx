import { ProductForm } from '../_components/product-form';

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <div className="rounded-md border bg-card p-6">
                <ProductForm />
            </div>
        </div>
    );
}
