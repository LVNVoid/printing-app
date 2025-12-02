'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { CategoryDialog } from './category-dialog';
import { deleteCategory } from '../actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

interface CategoryTableProps {
    categories: {
        id: string;
        name: string;
        slug: string;
        _count: { products: number };
    }[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        startTransition(async () => {
            const result = await deleteCategory(id);
            if (result.success) {
                toast.success('Category deleted');
            } else {
                toast.error(result.error as string);
            }
        });
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No categories found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>{category._count.products}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <CategoryDialog category={category} />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(category.id)}
                                            disabled={isPending}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
