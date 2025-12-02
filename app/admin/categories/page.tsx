import { Suspense } from 'react';
import { getCategories } from './actions';
import { CategoryTable } from './_components/category-table';
import { CategoryDialog } from './_components/category-dialog';

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">Manage your product categories.</p>
                </div>
                <CategoryDialog />
            </div>

            <Suspense fallback={<div>Loading categories...</div>}>
                <CategoryTable categories={categories} />
            </Suspense>
        </div>
    );
}
