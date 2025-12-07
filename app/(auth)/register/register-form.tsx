'use client';

import { cn } from '@/lib/utils';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { SignUp } from '@/actions/auth';

const registerSchema = z.object({
    name: z.string().min(2, { message: 'Nama harus minimal 2 karakter' }),
    email: z.string().email({ message: 'Alamat email tidak valid' }),
    phoneNumber: z
        .string()
        .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
            message: 'Format nomor telepon Indonesia tidak valid',
        }),
    password: z
        .string()
        .min(6, { message: 'Kata sandi harus minimal 6 karakter' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('password', data.password);

        try {
            const result = await SignUp({} as any, formData);

            if (result?.error) {
                setError(result.error);
            }

        } catch (err) {
            console.error(err);
            setError('Terjadi kesalahan yang tidak terduga');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Buat akun</CardTitle>
                    <CardDescription>
                        Masukkan detail Anda di bawah ini untuk membuat akun
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Nama</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    {...register('name')}
                                    suppressHydrationWarning
                                />
                                <FieldError errors={[{ message: errors.name?.message }]} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register('email')}
                                    suppressHydrationWarning
                                />
                                <FieldError errors={[{ message: errors.email?.message }]} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phoneNumber">Nomor Telepon</FieldLabel>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="08123456789"
                                    {...register('phoneNumber')}
                                    suppressHydrationWarning
                                />
                                <FieldError
                                    errors={[{ message: errors.phoneNumber?.message }]}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Kata sandi</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    suppressHydrationWarning
                                />
                                <FieldError errors={[{ message: errors.password?.message }]} />
                            </Field>
                            {error && (
                                <div className="text-sm text-destructive font-medium">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sedang membuat akun...' : 'Daftar'}
                            </Button>
                            <div className="text-center text-sm">
                                Sudah punya akun?{' '}
                                <Link href="/login" className="underline underline-offset-4">
                                    Masuk
                                </Link>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
