import { GymStatus } from "@prisma/client";
import z from "zod";

export const gymRequestSchema = z.object({
  name: z.string("Le nom de la salle de sport est obligatoire."),
  description: z.string("La description est obligatoire."),
  address: z.string("L'adresse est obligatoire."),
  phone: z.string("Le numéro de téléphone est obligatoire."),
  email: z.email("L'email doit être valide."),
});

export const gymRequestDecisionSchema = z.object({
  status: z.enum(GymStatus),
  name: z.string("Le nom de la salle de sport est obligatoire."),
  description: z.string("La description est obligatoire."),
  address: z.string("L'adresse est obligatoire."),
  phone: z.string("Le numéro de téléphone est obligatoire."),
  email: z.email("L'email doit être valide."),
});
  
export type gymRequestType = z.infer<typeof gymRequestSchema>;
export type gymRequestDecisionType = z.infer<typeof gymRequestDecisionSchema>;
