'use server';

import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { ProfileSchema } from '@/schemas/profile';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import bcrypt from 'bcrypt';

interface FormState {
  success: boolean;
  error: string | null;
}

export async function updateProfile(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return { success: false, error: 'Tidak terotorisasi' };
  }

  const name = formData.get('name');
  const email = formData.get('email');
  const phoneNumber = formData.get('phoneNumber');
  const password = formData.get('password');
  const file = formData.get('image') as File | null;

  const parsed = ProfileSchema.safeParse({
    name,
    email,
    phoneNumber,
    password,
    image: file ?? undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0].message,
    };
  }

  const data = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { success: false, error: 'Pengguna tidak ditemukan' };
  }

  // Check uniqueness for email and phone number if changed
  if (data.email !== user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      return { success: false, error: 'Email sudah terdaftar' };
    }
  }

  if (data.phoneNumber !== user.phoneNumber) {
    const existingPhone = await prisma.user.findFirst({
      where: { phoneNumber: data.phoneNumber },
    });
    if (existingPhone) {
      return { success: false, error: 'Nomor telepon sudah terdaftar' };
    }
  }

  let imageUrl = user.profileUrl;
  let imagePublicId = user.profilePublicId;

  if (data.image && data.image.size > 0) {
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
    }

    const arrayBuffer = await data.image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'users',
            resource_type: 'image',
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  }

  const updateData: any = {
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    profileUrl: imageUrl,
    profilePublicId: imagePublicId,
  };

  if (data.password && data.password.length >= 6) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  revalidatePath('/profile');
  revalidatePath('/');
  revalidatePath('/admin/dashboard');
  return { success: true, error: null };
}
