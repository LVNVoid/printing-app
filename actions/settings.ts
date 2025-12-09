'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
    try {
        let settings = await prisma.storeSettings.findFirst();

        if (!settings) {
            settings = await prisma.storeSettings.create({
                data: {
                    storeName: 'Foman Printing',
                },
            });
        }

        return { success: true, settings };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { success: false, error: 'Failed to fetch settings' };
    }
}

export async function updateSettings(formData: FormData) {
    try {
        const storeName = formData.get('storeName') as string;
        const whatsappNumber = formData.get('whatsappNumber') as string;
        const contactEmail = formData.get('contactEmail') as string;
        const contactAddress = formData.get('contactAddress') as string;
        const googleMapsEmbedUrl = formData.get('googleMapsEmbedUrl') as string;
        const openDays = formData.get('openDays') as string;
        const openHours = formData.get('openHours') as string;

        console.log('Update Settings Request:', {
            storeName,
            whatsappNumber,
            contactEmail,
            contactAddress,
            openDays,
            openHours
        });

        const settings = await prisma.storeSettings.findFirst();

        if (settings) {
            console.log('Updating existing settings ID:', settings.id);
            await prisma.storeSettings.update({
                where: { id: settings.id },
                data: {
                    storeName,
                    whatsappNumber,
                    contactEmail,
                    contactPhone: whatsappNumber, // Sync with whatsappNumber
                    contactAddress,
                    googleMapsEmbedUrl,
                    openDays,
                    openHours,
                },
            });
        } else {
            console.log('No settings found, creating new.');
            await prisma.storeSettings.create({
                data: {
                    storeName,
                    whatsappNumber,
                    contactEmail,
                    contactPhone: whatsappNumber, // Sync with whatsappNumber
                    contactAddress,
                    googleMapsEmbedUrl,
                    openDays,
                    openHours,
                },
            });
        }

        revalidatePath('/admin/settings');
        revalidatePath('/contact');
        revalidatePath('/about');
        
        return { success: true, message: 'Settings updated successfully' };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
