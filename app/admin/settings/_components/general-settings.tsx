'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateStoreSettings } from '../actions';
import { useFormStatus } from 'react-dom';
import { StoreSettings } from '@/app/generated/prisma/client';
import { useActionState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Changes'}
        </Button>
    );
}

export function GeneralSettings({ settings }: { settings: StoreSettings | null }) {
    const [state, formAction] = useActionState(updateStoreSettings, null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your store's general information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4 max-w-xl">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                            id="storeName"
                            name="storeName"
                            defaultValue={settings?.storeName || 'My Store'}
                            required
                        />
                        {state?.error?.storeName && (
                            <p className="text-sm text-red-500">{state.error.storeName[0]}</p>
                        )}
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
