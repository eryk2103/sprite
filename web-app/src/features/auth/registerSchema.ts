import { z } from 'zod';

export const registerSchema = z
    .object({
        email: z.string().min(1, 'Email is required').email('Enter a valid email'),
        password: z.string()
            .min(6, 'Password must be at least 6 characters')
            .regex(/[0-9]/, 'Password must contain a digit')
            .regex(/[a-z]/, 'Password must contain a lowercase letter')
            .regex(/[A-Z]/, 'Password must contain an uppercase letter')
            .regex(/[^a-zA-Z0-9]/, 'Password must contain a non-alphanumeric character'),
        confirmPassword: z.string().min(1, 'Confirm your password'),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;
