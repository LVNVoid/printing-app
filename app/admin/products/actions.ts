'use server';

import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { UploadApiResponse } from 'cloudinary';
import slugify from 'slugify';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  categoryId: z.string().optional(),
  image: z.any().optional(),
});

export async function getProducts({
  query,
  categoryId,
  page = 1,
  limit = 10,
}: {
  query?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
} = {}) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (categoryId && categoryId !== 'all') {
    where.categoryId = categoryId;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { pictures: true, category: true },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalProducts: total,
  };
}

export async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { pictures: true, category: true },
  });
}

async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'products',
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

async function generateUniqueSlug(name: string) {
  let slug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
}

export async function createProduct(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const files = formData.getAll('images') as File[];
  
  // Remove images from data to validate other fields
  const { images: _images, ...otherData } = data;
  const result = productSchema.safeParse({ ...otherData });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const uploadedImages = [];

  for (const file of files) {
    if (file.size > 0) {
        if (file.size > 2 * 1024 * 1024) {
            return { error: { images: [`File ${file.name} size must be less than 2MB`] } };
        }
        try {
            const uploaded = await uploadImage(file);
            uploadedImages.push({
                imageUrl: uploaded.secure_url,
                imagePublicId: uploaded.public_id,
            });
        } catch (error) {
            console.error(`Image upload failed for ${file.name}:`, error);
            return { error: { images: [`Image upload failed for ${file.name}`] } };
        }
    }
  }

  const slug = await generateUniqueSlug(result.data.name);

  await prisma.product.create({
    data: {
      name: result.data.name,
      slug,
      description: result.data.description,
      price: result.data.price,
      categoryId: result.data.categoryId || null,
      pictures: {
        create: uploadedImages
      },
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const files = formData.getAll('images') as File[];
  
  // Remove images from data to validate other fields
  const { images: _images, ...otherData } = data;
  const result = productSchema.safeParse({ ...otherData });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  // Handle image deletions
  const deletedImageIds = formData.getAll('deletedImageIds') as string[];
  if (deletedImageIds.length > 0) {
      const imagesToDelete = await prisma.productPicture.findMany({
          where: {
              id: { in: deletedImageIds },
              productId: id, // Ensure images belong to this product
          }
      });

      for (const image of imagesToDelete) {
          if (image.imagePublicId) {
              try {
                  await cloudinary.uploader.destroy(image.imagePublicId);
              } catch (error) {
                  console.error(`Failed to delete image from Cloudinary: ${image.imagePublicId}`, error);
              }
          }
      }

      await prisma.productPicture.deleteMany({
          where: {
              id: { in: deletedImageIds },
              productId: id,
          }
      });
  }

  for (const file of files) {
    if (file.size > 0) {
        if (file.size > 2 * 1024 * 1024) {
            return { error: { images: [`File ${file.name} size must be less than 2MB`] } };
        }
        try {
            const uploaded = await uploadImage(file);
            
            await prisma.productPicture.create({
                data: {
                    productId: id,
                    imageUrl: uploaded.secure_url,
                    imagePublicId: uploaded.public_id,
                }
            });
        } catch (error) {
            console.error(`Image upload failed for ${file.name}:`, error);
            return { error: { images: [`Image upload failed for ${file.name}`] } };
        }
    }
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      categoryId: result.data.categoryId || null,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { pictures: true },
  });

  if (product) {
    for (const picture of product.pictures) {
        if (picture.imagePublicId) {
            await cloudinary.uploader.destroy(picture.imagePublicId);
        }
    }
    
    // Delete associated pictures from database first
    await prisma.productPicture.deleteMany({
        where: { productId: id },
    });
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
  revalidatePath('/products');
}