import { z } from "zod";

export const GetLongInput = z.object({
  short: z.string(),
});
export type TGetLongInput = z.infer<typeof GetLongInput>;

export const GetLongOutput = z.object({
  long: z.string().url(),
});
export type TGetLongOutput = z.infer<typeof GetLongOutput>;
