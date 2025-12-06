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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { CategoryDialog } from './category-dialog';
import { deleteCategory } from '../actions';
import { toast } from 'sonner';
import { useTransition } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</TableHead>
                        <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</TableHead>
                        <TableHead className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Products</TableHead>
                        <TableHead className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</TableHead>
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
                                <TableCell className="px-4 align-middle font-medium">{category.name}</TableCell>
                                <TableCell className='px-4 align-middle'>{category.slug}</TableCell>
                                <TableCell className='px-4 align-middle'>{category._count.products}</TableCell>
                                <TableCell className="px-4 align-middle text-right">
                                    <div className="flex justify-end gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <CategoryDialog
                                                    category={category}
                                                    trigger={
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                    }
                                                />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
