import { z } from "zod";

export const responseSchemaForFront = z.object({
  payload: z
    .string({
      required_error: "Response is required",
    })
    .min(1),
});

export const responseSchema = z.object({
  payload: z
    .string({
      required_error: "Response is required",
    })
    .min(1),
  tweetId: z.string(),
});

export type ResponseType = z.infer<typeof responseSchema>;
