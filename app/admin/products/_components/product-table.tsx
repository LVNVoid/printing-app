'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DeleteProductButton } from './delete-product-button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    category: { name: string } | null;
    pictures: { imageUrl: string | null }[];
}

interface ProductTableProps {
    products: Product[];
    totalPages: number;
    currentPage: number;
}

export function ProductTable({ products, totalPages, currentPage }: ProductTableProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            {product.pictures && product.pictures.length > 0 && product.pictures[0].imageUrl ? (
                                                <div className="relative w-16 h-16 rounded overflow-hidden border">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={product.pictures[0].imageUrl}
                                                        alt={product.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                                                    No Img
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle font-medium">{product.name}</td>
                                        <td className="p-4 align-middle">{product.category?.name || '-'}</td>
                                        <td className="p-4 align-middle">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}
                                        </td>
                                        <td className="p-4 align-middle max-w-xs truncate">{product.description}</td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/products/${product.id}`}>View</Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                                                </Button>
                                                <DeleteProductButton id={product.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
