'use server';

import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import slugify from 'slugify';
import type { UploadApiResponse } from 'cloudinary';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });
}

async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'categories',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        }
      )
      .end(buffer);
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

  let imageUrl = null;
  let imagePublicId = null;

  const imageFile = formData.get('image') as File;
  if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 2 * 1024 * 1024) {
          return { error: { name: ['Image size must be less than 2MB'] } };
      }
      try {
          const uploaded = await uploadImage(imageFile);
          imageUrl = uploaded.secure_url;
          imagePublicId = uploaded.public_id;
      } catch (error) {
          console.error('Image upload failed:', error);
          return { error: { name: ['Failed to upload image'] } };
      }
  }

  try {
    await prisma.category.create({
      data: {
        name: result.data.name,
        slug,
        imageUrl,
        imagePublicId,
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

    const category = await prisma.category.findUnique({ where: { id } });
    let imageUrl = category?.imageUrl;
    let imagePublicId = category?.imagePublicId;

    // Handle Image Deletion
    const deleteImage = formData.get('deleteImage') === 'true';
    if (deleteImage && category?.imagePublicId) {
        try {
            await cloudinary.uploader.destroy(category.imagePublicId);
            imageUrl = null;
            imagePublicId = null;
        } catch (error) {
            console.error('Failed to delete image from Cloudinary:', error);
        }
    }

    // Handle New Image Upload
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
        // If there was an old image and we didn't just delete it (or even if we did), we upload new one.
        // If we didn't explicitly delete but are replacing, we should delete the old one first.
        if (imagePublicId && !deleteImage) {
             try {
                await cloudinary.uploader.destroy(imagePublicId);
            } catch (error) {
                console.error('Failed to delete old image from Cloudinary:', error);
            }
        }

        if (imageFile.size > 2 * 1024 * 1024) {
            return { error: { name: ['Image size must be less than 2MB'] } };
        }
        try {
            const uploaded = await uploadImage(imageFile);
            imageUrl = uploaded.secure_url;
            imagePublicId = uploaded.public_id;
        } catch (error) {
            console.error('Image upload failed:', error);
            return { error: { name: ['Failed to upload image'] } };
        }
    }

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name: result.data.name,
                slug,
                imageUrl,
                imagePublicId,
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
        const category = await prisma.category.findUnique({ where: { id } });
        
        // Delete image from Cloudinary if exists
        if (category?.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(category.imagePublicId);
            } catch (error) {
                console.error('Failed to delete image from Cloudinary:', error);
            }
        }

        // Unlink products (set categoryId to null)
        await prisma.product.updateMany({
            where: { categoryId: id },
            data: { categoryId: null },
        });

        // Delete the category
        await prisma.category.delete({
            where: { id },
        });

        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { error: 'Gagal menghapus kategori.' };
    }
}
