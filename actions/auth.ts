'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

export async function SignUp(
  prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string }> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const exists = await prisma.user.findUnique({
    where: { email },
  });

  if (exists) {
    return { error: 'Email already registered' };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'CUSTOMER',
    },
  });

  redirect('/login');
}
