import { z } from 'zod';

/** Test */
export const testRequestDto = z.object({
  message: z.string(),
});
export type TestRequest = z.infer<typeof testRequestDto>;

export const testResponseDto = z.object({
  message: z.string(),
});
export type TestResponse = z.infer<typeof testResponseDto>;

export const testFileRequestDto = z.object({
  formData: z.any(),
});
export type TestFileRequest = z.infer<typeof testFileRequestDto>;

export type EvaluteRequest = FormData;

export const evaluateResponseDto = z.object({
  metadata: z.object({
    score: z.number(),
    notes: z.string().array()
  }),
  contentIntegrity: z.object({
    score: z.number(),
    notes: z.string().array()
  }),
  visualForensics: z.object({
    score: z.number(),
    notes: z.string().array()
  }),
  consistency: z.object({
    score: z.number(),
    notes: z.string().array()
  }),
});
export type EvaluateResponse = z.infer<typeof evaluateResponseDto>;