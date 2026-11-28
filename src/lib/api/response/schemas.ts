import { z } from 'zod';

export const apiMetaSchema = z.object({
  requestId: z.string().min(1),
});

export const apiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.string().regex(/^[a-z0-9_]+$/),
    message: z.string().min(1).max(240),
    retryable: z.boolean(),
    retryAfterSeconds: z.number().int().positive().optional(),
    details: z.unknown().optional(),
  }),
  meta: apiMetaSchema,
});

export function apiSuccessSchema<T extends z.ZodType>(data: T) {
  return z.object({
    ok: z.literal(true),
    data,
    meta: apiMetaSchema,
  });
}

export function apiEnvelopeSchema<T extends z.ZodType>(data: T) {
  return z.union([apiSuccessSchema(data), apiErrorSchema]);
}
