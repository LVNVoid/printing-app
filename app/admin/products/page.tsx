import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { getCategories, getProducts } from './actions';
import Link from 'next/link';
import { ProductTable } from './_components/product-table';
import { ProductToolbar } from './_components/product-toolbar';

interface ProductsAdminPageProps {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
    page?: string;
  }>;
}

const ProductsAdminPage = async ({ searchParams }: ProductsAdminPageProps) => {
  const params = await searchParams;
  const query = params.query || '';
  const categoryId = params.categoryId || '';
  const currentPage = Number(params.page) || 1;

  const { products, totalPages } = await getProducts({
    query,
    categoryId,
    page: currentPage,
    limit: 6,
  });

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>


      <Suspense fallback={<div>Loading toolbar...</div>}>
        <ProductToolbar categories={categories} />
      </Suspense>

      <Suspense fallback={<div>Loading table...</div>}>
        <ProductTable
          products={products}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
};

export default ProductsAdminPage;
