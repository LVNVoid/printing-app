'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSchema, ProfileSchemaType } from '@/schemas/profile';
import { updateProfile } from '@/actions/profile';
import Image from 'next/image';
import { useRouter } from 'next/navigation';



interface ProfileFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        profileUrl: string | null;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(user.profileUrl);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProfileSchemaType>({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            password: '',
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setValue('image', file);
        }
    };

    const onSubmit = (data: ProfileSchemaType) => {
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phoneNumber', data.phoneNumber);
        if (data.password) {
            formData.append('password', data.password);
        }
        if (data.image) {
            formData.append('image', data.image);
        }

        startTransition(async () => {
            const result = await updateProfile({ success: false, error: null }, formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess('Profile updated successfully');
                router.refresh();
            }
        });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                    Update your personal information and profile picture.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Profile"
                                    width={128}
                                    height={128}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full max-w-[250px]"
                        />
                    </div>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input id="name" {...register('name')} />
                            <FieldError errors={[{ message: errors.name?.message }]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="email" {...register('email')} />
                            <FieldError errors={[{ message: errors.email?.message }]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                            <Input id="phoneNumber" type="tel" {...register('phoneNumber')} />
                            <FieldError errors={[{ message: errors.phoneNumber?.message }]} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">New Password (Optional)</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Leave blank to keep current password"
                                {...register('password')}
                            />
                            <FieldError errors={[{ message: errors.password?.message }]} />
                        </Field>
                    </FieldGroup>

                    {error && (
                        <div className="text-sm text-destructive font-medium">{error}</div>
                    )}
                    {success && (
                        <div className="text-sm text-green-600 font-medium">{success}</div>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
