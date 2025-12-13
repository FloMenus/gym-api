import { ChallengeDifficulty } from "@prisma/client";
import z from "zod";

export const challengeSchema = z.object({
    title: z.string("Le titre du défi est obligatoire.").min(3, "Le titre doit contenir au moins 3 caractères."),
    description: z.string().optional(),
    difficulty: z.enum(ChallengeDifficulty),
    deadline: z.coerce.date().optional(),
    creatorId: z.number("L'identifiant du créateur est obligatoire."),
    exerciseTypeIds: z.array(z.number("Les IDs de types d'exercice doivent être des nombres.")).min(1, "Au moins un type d'exercice doit être spécifié."),
});

export type challengeType = z.infer<typeof challengeSchema>;