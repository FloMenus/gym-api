import z from "zod";

export const exerciseTypeSchema = z.object({
  name: z.string("Le nom du type d'exercice est obligatoire."),
  description: z.string("La description du type d'exercice est obligatoire."),
});

export type exerciseTypeType = z.infer<typeof exerciseTypeSchema>;
