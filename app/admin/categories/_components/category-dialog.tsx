'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { createCategory, updateCategory } from '../actions';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Category' : 'Create Category')}
        </Button>
    );
}

interface CategoryDialogProps {
    category?: { id: string; name: string };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CategoryDialog({ category, open: controlledOpen, onOpenChange: controlledOnOpenChange, trigger }: CategoryDialogProps & { trigger?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const isEditing = !!category;

    // Use controlled state if provided, otherwise local state
    const isOpen = controlledOpen !== undefined ? controlledOpen : open;
    const onOpenChange = controlledOnOpenChange || setOpen;

    const action = isEditing ? updateCategory.bind(null, category.id) : createCategory;
    const [state, formAction] = useActionState(action, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(isEditing ? 'Category updated' : 'Category created');
            onOpenChange(false);
        }
    }, [state, isEditing, onOpenChange]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {trigger ? trigger : (isEditing ? (
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                ) : (
                    <Button>
                        Add Category
                    </Button>
                ))}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Category' : 'Create Category'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the category details below.' : 'Add a new category to your store.'}
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={category?.name}
                            required
                        />
                        {state?.error?.name && (
                            <p className="text-sm text-red-500">{state.error.name[0]}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <SubmitButton isEditing={isEditing} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
