import z from "zod";

export const gymRequestSchema = z.object({
  name: z.string().min(1, "Le nom de la salle est obligatoire."),
  address: z.string().min(1, "L'adresse est obligatoire."),
  contact: z.string().min(1, "Le contact est obligatoire."),
});

export type gymRequestType = z.infer<typeof gymRequestSchema>;

