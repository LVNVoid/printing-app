import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email({ pattern: z.regexes.email }),
  password: z.string().min(6, 'Password length must be at least 6 characters'),
  image: z.instanceof(File).optional(),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
