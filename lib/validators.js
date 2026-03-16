import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
  membershipType: z.enum(['personal', 'business']).default('personal'),
  adminKey: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or member number is required'),
  password: z.string().min(1, 'Password is required'),
});

export const depositSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  amount: z.number().positive('Amount must be positive').max(50000, 'Single deposit limit is $50,000'),
  description: z.string().max(200).optional(),
});

export const withdrawSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  amount: z.number().positive('Amount must be positive').max(10000, 'Single withdrawal limit is $10,000'),
  description: z.string().max(200).optional(),
});

export const transferSchema = z.object({
  fromAccountId: z.string().min(1, 'Source account is required'),
  toAccountId: z.string().min(1, 'Destination account is required'),
  amount: z.number().positive('Amount must be positive').max(25000, 'Single transfer limit is $25,000'),
  description: z.string().max(200).optional(),
});

export const cardRequestSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required'),
  cardType: z.enum(['debit', 'credit', 'prepaid']),
  deliveryAddress: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(2).max(2),
      zip: z.string().min(5).max(10),
    })
    .optional(),
});

export const adminCreditDebitSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500),
});

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }
  const errors = result.error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  return { success: false, data: null, errors };
}
