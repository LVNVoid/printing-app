'use server';

import prisma from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function getSession() {
  return await getServerSession(authOptions);
}

export async function getNotifications(limit = 20) {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return [];

  return await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getUnreadNotificationCount() {
  const session = await getSession();
  if (!session?.user?.email) return 0;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return 0;

  return await prisma.notification.count({
    where: {
      userId: user.id,
      isRead: false,
    },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  const session = await getSession();
  if (!session?.user?.email) return { error: 'Unauthorized' };

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
  
  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session?.user?.email) return { error: 'Unauthorized' };

  const user = await prisma.user.findUnique({
      where: { email: session.user.email },
  });
  if (!user) return { error: 'User not found' };

  await prisma.notification.updateMany({
    where: { userId: user.id, isRead: false },
    data: { isRead: true },
  });

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true };
}

export async function createNotification(data: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        link: data.link,
      },
    });

    // Trigger Pusher event
    await pusherServer.trigger(
      `user-${data.userId}`,
      'notification',
      notification
    );

    return { success: true, notification };
  } catch (error) {
    console.error('Failed to create notification:', error);
    return { error: 'Failed to create notification' };
  }
}
