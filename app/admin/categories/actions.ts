'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import slugify from 'slugify';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}

export async function createCategory(prevState: any, formData: FormData) {
  const result = categorySchema.safeParse({
    name: formData.get('name'),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const slug = slugify(result.data.name, { lower: true, strict: true });
  
  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    return { error: { name: ['Category already exists'] } };
  }

  try {
    await prisma.category.create({
      data: {
        name: result.data.name,
        slug,
      },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { error: { name: ['Failed to create category'] } };
  }
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    const result = categorySchema.safeParse({
        name: formData.get('name'),
    });

    if (!result.success) {
        return { error: result.error.flatten().fieldErrors };
    }

    const slug = slugify(result.data.name, { lower: true, strict: true });

    // Check if slug exists on OTHER categories
    const existingCategory = await prisma.category.findFirst({
        where: { 
            slug,
            NOT: { id }
        },
    });

    if (existingCategory) {
        return { error: { name: ['Category name already exists'] } };
    }

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name: result.data.name,
                slug,
            },
        });

        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to update category:', error);
        return { error: { name: ['Failed to update category'] } };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { error: 'Failed to delete category. It might contain products.' };
    }
}
