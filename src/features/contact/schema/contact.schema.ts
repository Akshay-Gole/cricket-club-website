import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),

  email: z.email('Valid email required'),

  phone: z.string().trim().optional(),

  subject: z.string().trim().min(1, 'Subject is required'),

  message: z.string().trim().min(1, 'Please write a message'),

  role: z.string().optional(),
  experience: z.string().optional(),

  company: z.string().optional(),
  interest: z.string().optional(),

  website: z
    .string()
    .trim()
    .refine(
      value => value === '' || URL.canParse(value),
      'Enter a valid website URL'
    )
    .optional(),

  nickname: z.string().max(0).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
