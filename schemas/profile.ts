import { z } from 'zod';

export const ProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Alamat email tidak valid'),
  phoneNumber: z
    .string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Format nomor telepon Indonesia tidak valid'),
  password: z
    .string()
    .min(6, 'Kata sandi minimal 6 karakter')
    .optional()
    .or(z.literal(''))
    .or(z.literal(null)),
  image: z.instanceof(File).optional(),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
