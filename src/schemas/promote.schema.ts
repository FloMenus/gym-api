import z from "zod";

export const promoteSchema = z.object({
  email: z.email("L'email est obligatoire."),
});

export type promoteType = z.infer<typeof promoteSchema>;