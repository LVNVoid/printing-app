'use server';

import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import type { UploadApiResponse } from 'cloudinary';

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
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, banners };
    } catch (error) {
        console.error('Error fetching banners:', error);
        return { success: false, error: 'Failed to fetch banners' };
    }
}

export async function createBanner(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const link = formData.get('link') as string;
        const active = formData.get('active') === 'on'; // Switch sends 'on' if checked, or check logic
        const imageFile = formData.get('image') as File;

        if (!imageFile || imageFile.size === 0) {
            return { success: false, error: 'Image is required' };
        }

        const uploaded = await uploadImage(imageFile);

        const banner = await prisma.banner.create({
            data: {
                title,
                imageUrl: uploaded.secure_url,
                imagePublicId: uploaded.public_id,
                link,
                active,
            },
        });

        revalidatePath('/admin/settings');
        revalidatePath('/');
        return { success: true, message: 'Banner created successfully', banner };
    } catch (error) {
        console.error('Error creating banner:', error);
        return { success: false, error: 'Failed to create banner' };
    }
}

export async function deleteBanner(id: string) {
    try {
        const banner = await prisma.banner.findUnique({
            where: { id },
        });

        if (banner?.imagePublicId) {
            await cloudinary.uploader.destroy(banner.imagePublicId);
        }

        await prisma.banner.delete({
            where: { id },
        });

        revalidatePath('/admin/settings');
        revalidatePath('/');
        return { success: true, message: 'Banner deleted successfully' };
    } catch (error) {
        console.error('Error deleting banner:', error);
        return { success: false, error: 'Failed to delete banner' };
    }
}

export async function toggleBannerActive(id: string, newStatus: boolean) {
    try {
        const banner = await prisma.banner.update({
            where: { id },
            data: { active: newStatus },
        });

        revalidatePath('/admin/settings');
        revalidatePath('/');
        return { success: true, message: 'Banner status updated', banner };
    } catch (error) {
        console.error('Error updating banner status:', error);
        return { success: false, error: 'Failed to update banner status' };
    }
}
