import z from "zod";
import { BadgeType as type } from "@prisma/client";

export const badgeSchema = z.object({
  name: z.string("Le nom du type d'exercice est obligatoire."),
  description: z.string("La description du type d'exercice est obligatoire."),
  type: z.enum(type),
  value: z.number("La valeur est obligatoire."),
});

export type badgeType = z.infer<typeof badgeSchema>;
