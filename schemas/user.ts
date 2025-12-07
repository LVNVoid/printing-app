import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.email({ pattern: z.regexes.email }),
  phoneNumber: z
    .string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
      message: 'Format nomor telepon Indonesia tidak valid',
    }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' }),
  image: z.instanceof(File).optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
