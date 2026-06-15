import { z } from 'zod';

/**
 * Zod schemas shared by client forms (react-hook-form) and server route
 * handlers (request-body validation). Form value types are inferred from these
 * so there is a single source of truth for shape + validation rules.
 */

export const websiteFormSchema = z.object({
  name: z.string().trim().min(1, 'Site name is required'),
  url: z.string().trim().min(1, 'URL is required'),
});
export type WebsiteFormValues = z.infer<typeof websiteFormSchema>;

/** Partial update payload accepted by PUT /api/websites/[id]. */
export const websiteUpdateSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    url: z.string().trim().optional(),
    status: z.enum(['active', 'disabled']).optional(),
    lastStatus: z.enum(['success', 'failed']).nullable().optional(),
    lastCapture: z.string().nullable().optional(),
    error: z.string().nullable().optional(),
    lastCaptureImage: z.string().nullable().optional(),
  })
  .strip();

export const bulkWebsitesSchema = z.array(
  z.object({ name: z.string().trim().optional(), url: z.string().trim().optional() }),
);

export const userFormSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
  role: z.enum(['Viewer', 'Editor', 'Admin']),
});
export type UserFormValues = z.infer<typeof userFormSchema>;

export const smtpSchema = z.object({
  host: z.string().trim(),
  port: z.string().trim(),
  user: z.string().trim(),
  pass: z.string(),
});
export type SmtpFormValues = z.infer<typeof smtpSchema>;

export const recipientSchema = z.object({
  email: z.string().trim().email('Please enter a valid recipient email'),
});

export const scheduleTimeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, 'Invalid time format');

/** Settings PUT payload — any subset of the three sections. */
export const settingsUpdateSchema = z.object({
  smtp: smtpSchema.optional(),
  recipients: z.array(z.object({ id: z.number(), email: z.string().email() })).optional(),
  schedules: z
    .array(z.object({ id: z.number(), time: scheduleTimeSchema, enabled: z.boolean() }))
    .optional(),
});

export const excelProcessSchema = z.object({
  demo: z.boolean().optional(),
  file: z.string().optional(),
  fileName: z.string().optional(),
});
