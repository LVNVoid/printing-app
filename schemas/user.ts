import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email({ pattern: z.regexes.email }),
  phoneNumber: z
    .string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, {
      message: 'Invalid Indonesian phone number format',
    }),
  password: z.string().min(6, { message: 'Password length must be at least 6 characters' }),
  image: z.instanceof(File).optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
