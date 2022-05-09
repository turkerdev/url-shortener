import { z } from "zod";

export const CreateShortInput = z.object({
  long: z.string().url(),
});
export type TCreateShortInput = z.infer<typeof CreateShortInput>;

export const CreateShortOutput = z.object({
  short: z.string(),
});
export type TCreateShortOutput = z.infer<typeof CreateShortOutput>;
