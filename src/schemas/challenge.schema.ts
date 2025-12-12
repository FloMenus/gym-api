import z from "zod";

export const challengeSchema = z.object({
});

export type challengeType = z.infer<typeof challengeSchema>;