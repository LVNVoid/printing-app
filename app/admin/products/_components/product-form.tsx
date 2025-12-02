'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProduct, updateProduct } from '../actions';
import { getCategories } from '../../categories/actions';
import { useFormStatus } from 'react-dom';
import { useState, useEffect } from 'react';
import { Product, Category, ProductPicture } from '@/app/generated/prisma/client';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update Product' : 'Create Product'}
        </Button>
    );
}

type ProductWithPictures = Product & { pictures: ProductPicture[] };

export function ProductForm({ product }: { product?: ProductWithPictures | null }) {
    const isEditing = !!product;
    const action = isEditing ? updateProduct.bind(null, product.id) : createProduct;

    const formAction = async (formData: FormData) => {
        await action(formData);
    };

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        getCategories().then(setCategories);
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    return (
        <form action={formAction} className="space-y-4 max-w-xl">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={product?.name} required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    defaultValue={product?.price}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                    id="categoryId"
                    name="categoryId"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={product?.categoryId || ''}
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" defaultValue={product?.description || ''} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="images">Images (Max 2MB each)</Label>
                <Input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const invalidFiles = files.filter(file => file.size > 2 * 1024 * 1024);

                        if (invalidFiles.length > 0) {
                            alert(`Some files exceed the 2MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
                            e.target.value = '';
                            setPreviewUrls([]);
                        } else {
                            const newPreviewUrls = files.map(file => URL.createObjectURL(file));
                            setPreviewUrls(prev => {
                                prev.forEach(url => URL.revokeObjectURL(url));
                                return newPreviewUrls;
                            });
                        }
                    }}
                />
                {previewUrls.length > 0 && (
                    <div className="flex gap-4 flex-wrap mt-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <SubmitButton isEditing={isEditing} />
                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
