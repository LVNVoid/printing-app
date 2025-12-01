'use server';

import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { UserSchema } from '@/schemas/user';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import bcrypt from 'bcrypt';

interface FormState {
  success: boolean;
  error: string | null;
}

export async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const file = formData.get('image') as File | null;

  const parsed = UserSchema.safeParse({
    name,
    email,
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

  const hashedPassword = await bcrypt.hash(data.password, 10);

  let imageUrl = '';
  let imagePublicId = '';

  if (data.image) {
    const arrayBuffer = await data.image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'users',
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

    imageUrl = uploaded.secure_url;
    imagePublicId = uploaded.public_id;
  }

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      profileUrl: imageUrl,
      profilePublicId: imagePublicId,
    },
  });

  revalidatePath('/');
  redirect('/');
}

export async function deleteUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return { success: false, error: 'User tidak ditemukan' };

  if (user.profilePublicId) {
    await cloudinary.uploader.destroy(user.profilePublicId);
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath('/users');
}

export async function updateUser(prevState: FormState, formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');
  const file = formData.get('image') as File | null;

  const parsed = UserSchema.safeParse({
    name,
    email,
    password,
    image: file ?? undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return { success: false, error: 'User tidak ditemukan' };

  let imageUrl = existing.profileUrl;
  let imagePublicId = existing.profilePublicId;

  if (data.image) {
    if (imagePublicId) {
      await cloudinary.uploader.destroy(imagePublicId);
    }

    // Upload foto baru
    const arrayBuffer = await data.image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'users', resource_type: 'image' },
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

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      profileUrl: imageUrl,
      profilePublicId: imagePublicId,
    },
  });

  revalidatePath('/');
  redirect('/');
}
