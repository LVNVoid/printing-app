'use server';

import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { UploadApiResponse } from 'cloudinary';

const bannerSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().optional(),
  active: z.string().optional(),
});

async function uploadImage(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'banners',
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

export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createBanner(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const file = formData.get('image') as File;

  const result = bannerSchema.safeParse({
    title: data.title,
    link: data.link,
    active: data.active,
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  if (!file || file.size === 0) {
      return { error: { image: ['Image is required'] } };
  }

  if (file.size > 2 * 1024 * 1024) {
      return { error: { image: ['File size must be less than 2MB'] } };
  }

  try {
    const uploaded = await uploadImage(file);
    
    await prisma.banner.create({
      data: {
        title: result.data.title,
        link: result.data.link,
        active: formData.get('active') === 'on',
        imageUrl: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
      },
    });

    revalidatePath('/admin/settings');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create banner:', error);
    return { error: { form: ['Failed to create banner'] } };
  }
}

export async function deleteBanner(id: string) {
  const banner = await prisma.banner.findUnique({
    where: { id },
  });

  if (banner && banner.imagePublicId) {
    await cloudinary.uploader.destroy(banner.imagePublicId);
  }

  await prisma.banner.delete({
    where: { id },
  });

  revalidatePath('/admin/settings');
  revalidatePath('/');
}

export async function toggleBannerActive(id: string, active: boolean) {
  await prisma.banner.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/settings');
  revalidatePath('/');
}

export async function getActiveBanners() {
  return await prisma.banner.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getStoreSettings() {
  return await prisma.storeSettings.findFirst();
}

export async function updateStoreSettings(prevState: any, formData: FormData) {
  const storeName = formData.get('storeName') as string;
  const whatsappNumber = formData.get('whatsappNumber') as string;

  if (!storeName) {
    return { error: { storeName: ['Store name is required'] } };
  }

  // Validate WhatsApp Number
  // Must start with 62 and be numeric
  if (whatsappNumber) {
    const whatsappRegex = /^62\d+$/;
    if (!whatsappRegex.test(whatsappNumber)) {
        return { error: { whatsappNumber: ['Nomor WhatsApp harus diawali dengan 62 dan hanya berisi angka'] } };
    }
  }

  const existingSettings = await prisma.storeSettings.findFirst();

  if (existingSettings) {
    await prisma.storeSettings.update({
      where: { id: existingSettings.id },
      data: { storeName, whatsappNumber },
    });
  } else {
    await prisma.storeSettings.create({
      data: { storeName, whatsappNumber },
    });
  }

  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: true };
}
