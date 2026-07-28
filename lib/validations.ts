import * as z from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be exactly 10 digits'),
  college: z.string().min(2, 'College name is required'),
  department: z.string().min(2, 'Department is required'),
  year: z.enum(['1', '2', '3', '4']),
  teamSize: z.enum(['1', '2']),
  teammateName: z.string().optional(),
  eventId: z.string().min(1, 'Please select an event'),
  paymentId: z.string().min(6, 'Payment transaction ID is required'),
  paymentScreenshot: z.any().refine((val) => val !== undefined && val !== '', "Payment screenshot is required"),
});

export type RegisterData = z.infer<typeof registerSchema>;
